import { config, seal, unseal, metadata, insideRoot, listChildren, rightsManifest, isApproved, jsonResponse, errorResponse, FOLDER_MIME } from './_shared/drive.mjs';

export default async function handler(request) {
  if (request.method !== 'GET') return jsonResponse({ ok: false }, 405);
  try {
    const configRoots = config();
    const url = new URL(request.url);
    const folderToken = url.searchParams.get('folder');
    const pageToken = url.searchParams.get('page');
    if (!folderToken) {
      if (pageToken) return jsonResponse({ ok: false, message: 'Invalid pagination.' }, 400);
      // No Google IDs or Drive URLs are sent to the browser.
      return jsonResponse({ ok: true, roots: configRoots.map((root) => ({
        type: 'folder', name: root.label, token: seal({ kind: 'folder', root: root.id, id: root.id }),
      })) });
    }
    const folder = unseal(folderToken, 'folder');
    if (!await insideRoot(folder.id, folder.root)) return jsonResponse({ ok: false }, 403);
    const detail = await metadata(folder.id);
    if (detail.mimeType !== FOLDER_MIME) return jsonResponse({ ok: false }, 400);
    let providerPage;
    if (pageToken) {
      const decoded = unseal(pageToken, 'cursor');
      if (decoded.root !== folder.root || decoded.id !== folder.id || typeof decoded.next !== 'string' || decoded.next.length > 2000) {
        return jsonResponse({ ok: false, message: 'Invalid pagination.' }, 400);
      }
      providerPage = decoded.next;
    }
    const [files, rights] = await Promise.all([listChildren(folder.id, providerPage), rightsManifest()]);
    const items = [];
    for (const file of files.files || []) {
      if (file.mimeType === FOLDER_MIME) {
        items.push({ type: 'folder', name: String(file.name || 'Senza nome').slice(0, 180), token: seal({
          kind: 'folder', root: folder.root, id: file.id,
        }) });
      } else if (/^image\/(jpeg|png|webp|gif|avif)$/.test(file.mimeType || '') && isApproved(rights, file.id)) {
        const permission = rights.items[file.id];
        const photoToken = seal({ kind: 'photo', root: folder.root, id: file.id });
        items.push({
          type: 'image', title: String(permission.title || file.name || 'Fotografia').slice(0, 180),
          author: permission.author.slice(0, 200), license: permission.license.slice(0, 160),
          alt: String(permission.alt || permission.title || file.name || 'Fotografia').slice(0, 250),
          width: file.imageMediaMetadata?.width || null, height: file.imageMediaMetadata?.height || null,
          preview: '/api/mylene/photo?preview=1&ref=' + encodeURIComponent(photoToken),
          full: '/api/mylene/photo?ref=' + encodeURIComponent(photoToken),
        });
      }
    }
    const nextPage = files.nextPageToken
      ? seal({ kind: 'cursor', root: folder.root, id: folder.id, next: files.nextPageToken })
      : null;
    return jsonResponse({
      ok: true, folderName: detail.name, items, nextPage,
      approvalsConfigured: rights.configured,
      note: !rights.configured ? 'Le cartelle sono visibili; le immagini richiedono crediti e autorizzazioni verificati.' : null,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export const config = { path: '/api/mylene/catalog' };
