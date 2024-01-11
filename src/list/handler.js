import listObjects from '../aem-classic/list';
import listBuckets from '../aem-classic/buckets';

export default function listHandler(req, env, daCtx) {
  if (req.method === 'GET') {
    if (!daCtx.org) return listBuckets(env, daCtx);
    return listObjects(env, daCtx);
  }

  return { body: JSON.stringify([]), status: 200, contentType: 'application/json' };
}
