// Audited chronology recovered from the original import folders.
// Aggregate metadata only. Never returns asset IDs, origins, credentials or source paths.
import chronology from '../../assets/data/archive-periods.json' with { type: 'json' };

export default async function handler(request) {
  if (!['GET', 'HEAD'].includes(request.method)) {
    return new Response('Method not allowed', {status: 405, headers: {'Allow': 'GET, HEAD', 'Cache-Control': 'no-store'}});
  }
  const body = request.method === 'HEAD' ? null : JSON.stringify(chronology);
  return new Response(body, {status: 200, headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'public, max-age=300, s-maxage=1800',
    'X-Content-Type-Options': 'nosniff'
  }});
}
