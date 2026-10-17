import { unseal, metadata, insideRoot, rightsManifest, isApproved, googleRequest, jsonResponse, errorResponse, GOOGLE_API, MAX_STREAM_BYTES } from './_shared/drive.mjs';

const imageMime = /^image\/(?:jpeg|png|webp|gif|avif)$/;
const headers = {
  'Cache-Control': 'private, max-age=120',
  'X-Content-Type-Options': 'nosniff',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Referrer-Policy': 'no-referrer',
  'Content-Security-Policy': "default-src 'none'",
  'Content-Disposition': 'inline',
};

async function streamThumbnail(url) {
  const target = new URL(url);
  if (target.protocol !== 'https:' || !(
    target.hostname === 'googleusercontent.com' ||
    target.hostname.endsWith('.googleusercontent.com') ||
    target.hostname === 'drive.google.com'
  )) throw new Error('Thumbnail provider blocked');
  const response = await fetch(target, { signal: AbortSignal.timeout(18000), redirect: 'follow' });
  if (!response.ok || !response.body) throw new Error('Thumbnail not available');
  const size = Number(response.headers.get('content-length') || 0);
  const mime = response.headers.get('content-type')?.split(';')[0]?.trim() || 'image/jpeg';
  if (size > MAX_STREAM_BYTES || !imageMime.test(mime)) {
    await response.body.cancel();
    throw new Error('Thumbnail unsupported');
  }
  return new Response(response.body, { status: 200, headers: { ...headers, 'Content-Type': mime } });
}

export default async function handler(request) {
  if (request.method !== 'GET') return jsonResponse({ ok: false }, 405);
  try {
    const url = new URL(request.url);
    const photo = unseal(url.searchParams.get('ref'), 'photo');
    const [rights, file] = await Promise.all([rightsManifest(), metadata(photo.id)]);
    if (!isApproved(rights, photo.id)) return jsonResponse({ ok: false, message: 'Immagine non disponibile.' }, 403);
    if (!imageMime.test(file.mimeType || '')) return jsonResponse({ ok: false }, 415);
    if (!await insideRoot(photo.id, photo.root)) return jsonResponse({ ok: false }, 403);
    const wantPreview = url.searchParams.get('preview') === '1';
    if (wantPreview && file.thumbnailLink) {
      try { return await streamThumbnail(file.thumbnailLink); } catch (error) {
        console.warn('[mylene-drive] preview fallback', error.message);
      }
    }
    const size = Number(file.size || 0);
    if (size > MAX_STREAM_BYTES) {
      return jsonResponse({ ok: false, message: 'Originale troppo grande per lo streaming: anteprima disponibile se generata da Drive.' }, 413);
    }
    const resource = new URL(GOOGLE_API + '/' + encodeURIComponent(photo.id));
    resource.searchParams.set('alt', 'media');
    resource.searchParams.set('supportsAllDrives', 'true');
    const response = await googleRequest(resource);
    if (!response.ok || !response.body) throw new Error('Image fetch unavailable: ' + response.status);
    const upstreamLength = Number(response.headers.get('content-length') || 0);
    if (upstreamLength > MAX_STREAM_BYTES) {
      await response.body.cancel();
      return jsonResponse({ ok: false, message: 'Originale troppo grande per lo streaming.' }, 413);
    }
    return new Response(response.body, { status: 200, headers: { ...headers, 'Content-Type': file.mimeType } });
  } catch (error) {
    return errorResponse(error);
  }
}

export const config = { path: '/api/mylene/photo' };
