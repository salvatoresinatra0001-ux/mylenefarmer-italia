import { createSign, createHash, createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

const GOOGLE_API = 'https://www.googleapis.com/drive/v3/files';
const GOOGLE_TOKEN = 'https://oauth2.googleapis.com/token';
const FOLDER_MIME = 'application/vnd.google-apps.folder';
export const MAX_STREAM_BYTES = 19 * 1024 * 1024;
let cachedAccess = { token: '', expiresAt: 0 };
let cachedRights = { value: null, expiresAt: 0 };
const fileCache = new Map();

export function config() {
  const raw = process.env.MF_DRIVE_ROOTS_JSON || '[]';
  const list = JSON.parse(raw);
  if (!Array.isArray(list) || list.length === 0 || list.length > 10) throw new Error('Drive roots are not configured');
  return list.map((root) => {
    if (!validId(root.id) || typeof root.label !== 'string' || !root.label.trim()) {
      throw new Error('Invalid Drive root configuration');
    }
    return { id: root.id, label: root.label.slice(0, 110) };
  });
}

function validId(value) { return typeof value === 'string' && /^[\w-]{10,150}$/.test(value); }

function serviceAccount() {
  const raw = process.env.MF_DRIVE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('Drive service account is missing');
  const parsed = JSON.parse(raw);
  if (!parsed.client_email || !parsed.private_key || !parsed.private_key.includes('PRIVATE KEY')) {
    throw new Error('Invalid service account configuration');
  }
  return parsed;
}

function cryptoKey() {
  const credentials = serviceAccount();
  // The service account secret derives a stable per-project token encryption key.
  return createHash('sha256').update('MyleneFarmerItalia:DriveToken:v1').update(credentials.private_key).digest();
}

export function seal(payload) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', cryptoKey(), iv);
  const plain = Buffer.from(JSON.stringify({ ...payload, expires: Date.now() + 12 * 60 * 60 * 1000 }), 'utf8');
  const encrypted = Buffer.concat([cipher.update(plain), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString('base64url');
}

export function unseal(token, expectedKind) {
  if (typeof token !== 'string' || token.length < 45 || token.length > 1400 || !/^[\w-]+$/.test(token)) {
    throw new Error('Invalid token');
  }
  const raw = Buffer.from(token, 'base64url');
  const decipher = createDecipheriv('aes-256-gcm', cryptoKey(), raw.subarray(0, 12));
  decipher.setAuthTag(raw.subarray(12, 28));
  const obj = JSON.parse(Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString('utf8'));
  if (!obj || obj.kind !== expectedKind || !validId(obj.id) || !validId(obj.root) ||
    obj.expires < Date.now() || !config().some((root) => root.id === obj.root)) throw new Error('Invalid token');
  return obj;
}

function jwtPart(value) { return Buffer.from(JSON.stringify(value)).toString('base64url'); }

export async function accessToken() {
  if (cachedAccess.token && cachedAccess.expiresAt > Date.now() + 90_000) return cachedAccess.token;
  const credential = serviceAccount();
  const now = Math.floor(Date.now() / 1000);
  const data = jwtPart({ alg: 'RS256', typ: 'JWT' }) + '.' + jwtPart({
    iss: credential.client_email,
    scope: 'https://www.googleapis.com/auth/drive.readonly',
    aud: GOOGLE_TOKEN, iat: now, exp: now + 3500,
  });
  const sign = createSign('RSA-SHA256');
  sign.update(data); sign.end();
  const assertion = data + '.' + sign.sign(credential.private_key).toString('base64url');
  const response = await fetch(GOOGLE_TOKEN, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error('Google authentication failed: ' + response.status);
  const tokenData = await response.json();
  if (!tokenData.access_token) throw new Error('Google authentication returned no token');
  cachedAccess = { token: tokenData.access_token, expiresAt: Date.now() + Math.min(3300, Number(tokenData.expires_in) || 3300) * 1000 };
  return cachedAccess.token;
}

export async function googleRequest(url, options = {}) {
  const token = await accessToken();
  const target = new URL(url);
  if (target.origin !== 'https://www.googleapis.com' || !target.pathname.startsWith('/drive/v3/files')) {
    throw new Error('Blocked outbound Google API request');
  }
  let response;
  for (let attempt = 0; attempt < 3; attempt++) {
    response = await fetch(target, {
      ...options, headers: { Authorization: 'Bearer ' + token, ...(options.headers || {}) },
      signal: AbortSignal.timeout(18000),
    });
    if (![429, 500, 502, 503, 504].includes(response.status) || attempt === 2) break;
    await response.body?.cancel();
    await new Promise((resolve) => setTimeout(resolve, 300 * 2 ** attempt));
  }
  return response;
}

export async function metadata(id) {
  if (!validId(id)) throw new Error('Invalid ID');
  const record = fileCache.get(id);
  if (record && record.expires > Date.now()) return record.data;
  const url = new URL(GOOGLE_API + '/' + encodeURIComponent(id));
  url.searchParams.set('fields', 'id,name,mimeType,size,parents,thumbnailLink,webContentLink');
  url.searchParams.set('supportsAllDrives', 'true');
  const response = await googleRequest(url);
  if (!response.ok) throw new Error('Drive metadata failed: ' + response.status);
  const data = await response.json();
  if (fileCache.size > 1000) fileCache.clear();
  fileCache.set(id, { data, expires: Date.now() + 60_000 });
  return data;
}

export async function insideRoot(id, rootId) {
  if (id === rootId) return true;
  const queue = [id];
  const visited = new Set();
  for (let i = 0; queue.length && i < 100; i++) {
    const current = queue.shift();
    if (current === rootId) return true;
    if (visited.has(current)) continue;
    visited.add(current);
    const file = await metadata(current);
    for (const parent of file.parents || []) {
      if (parent === rootId) return true;
      if (validId(parent) && !visited.has(parent)) queue.push(parent);
    }
  }
  return false;
}

export async function listChildren(folderId, pageToken) {
  const url = new URL(GOOGLE_API);
  url.searchParams.set('q', "'" + folderId + "' in parents and trashed = false");
  url.searchParams.set('fields', 'nextPageToken,files(id,name,mimeType,size,imageMediaMetadata(width,height),modifiedTime)');
  url.searchParams.set('pageSize', '100');
  url.searchParams.set('orderBy', 'folder,name');
  url.searchParams.set('supportsAllDrives', 'true');
  url.searchParams.set('includeItemsFromAllDrives', 'true');
  if (pageToken) url.searchParams.set('pageToken', pageToken);
  const response = await googleRequest(url);
  if (!response.ok) throw new Error('Drive folder listing failed: ' + response.status);
  return response.json();
}

export async function rightsManifest() {
  const fileId = process.env.MF_DRIVE_RIGHTS_MANIFEST_ID;
  if (!fileId) return { configured: false, items: {} };
  if (!validId(fileId)) throw new Error('Invalid rights manifest ID');
  if (cachedRights.value && cachedRights.expiresAt > Date.now()) return cachedRights.value;
  const target = new URL(GOOGLE_API + '/' + encodeURIComponent(fileId));
  target.searchParams.set('alt', 'media');
  const response = await googleRequest(target);
  if (!response.ok) throw new Error('Rights catalog unavailable: ' + response.status);
  const text = await response.text();
  if (text.length > 4_000_000) throw new Error('Rights catalog is too large');
  const parsed = JSON.parse(text);
  if (parsed.version !== 1 || !parsed.items || typeof parsed.items !== 'object' || Array.isArray(parsed.items)) {
    throw new Error('Invalid rights catalog');
  }
  const result = { configured: true, items: parsed.items };
  cachedRights = { value: result, expiresAt: Date.now() + 60_000 };
  return result;
}

export function isApproved(rights, id) {
  const item = rights?.items?.[id];
  if (!item || item.status !== 'approved') return false;
  return ['author', 'license', 'authorization'].every((key) => typeof item[key] === 'string' && item[key].trim().length > 2);
}

export function jsonResponse(data, status = 200) {
  return Response.json(data, { status, headers: {
    'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer', 'Cross-Origin-Resource-Policy': 'same-origin',
  } });
}

export function errorResponse(error) {
  // Do not reflect exception text, Google IDs, file names, or secrets into public HTTP responses.
  const badRequest = error.message === 'Invalid token' || error.message === 'Invalid ID';
  const missing = /not configured|is missing|configuration|catalog unavailable/i.test(error.message);
  console.error('[mylene-drive]', String(error.message).replace(/[\r\n]/g, ' ').slice(0, 160));
  return jsonResponse({ ok: false, message: badRequest ? 'Riferimento non valido.' : 'Archivio temporaneamente non disponibile.' }, badRequest ? 400 : missing ? 503 : 502);
}

export { FOLDER_MIME, GOOGLE_API };
