import getAEMConfig from './utils/config';
import { buildBucketUrl } from './utils/client';

function mapJson(resp, daCtx) {
  const combined = [];
  let keys = Object.keys(resp);
  for (const key of keys) {
    if (
      key.startsWith('jcr:') ||
      key.startsWith('cq:') ||
      key.startsWith('rep:') ||
      key === 'dam' ||
      key === 'campaigns' ||
      key === 'projects' ||
      key === 'experience-fragments' ||
      key === 'outbound-marketing' ||
      key === 'usergenerated' ||
      key === 'launches'
    )
      delete resp[key];
  }
  keys = Object.keys(resp);
  console.log('keys', keys);
  for (const key of keys) {
    if (
      key.startsWith('jcr:') ||
      key.startsWith('cq:') ||
      key.startsWith('rep:')
    )
      continue;

    const child = resp[key];
    const created = child['jcr:content']['jcr:created'];
    combined.push({ name: key, created });
  }
  return combined;
}

export default async function listBuckets(env, daCtx) {
  const config = getAEMConfig(env);

  const url = buildBucketUrl(config);
  console.log(url);

  try {
    const resp = await fetch(url, {
      headers: { Authorization: `Bearer ${config.credentials.apiToken}` },
    });
    const body = mapJson(await resp.json(), daCtx);
    return {
      body: JSON.stringify(body),
      status: resp.status,
      contentType: resp.headers.get('Content-Type'),
    };
  } catch (e) {
    return { body: '', status: 404 };
  }
}
