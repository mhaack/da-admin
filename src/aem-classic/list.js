import getAEMConfig from './utils/config';
import { buildListUrl } from './utils/client';

function mapJson(resp, daCtx) {
  const combined = [];
  const keys = Object.keys(resp);
  for (const key of keys) {
    if (key.startsWith('jcr:') || key.startsWith('cq:')) continue;

    const child = resp[key];
    const jcrName = child['jcr:content']['jcr:title'];
    const slug = jcrName.toLowerCase().replace(/ /g, '-');
    const name = jcrName + (slug !== key ? ` (${key})` : '');

    const resourceType = child['jcr:content']['sling:resourceType'];
    const ext =
      resourceType === 'core/franklin/components/spreadsheet/v1/spreadsheet'
        ? 'json'
        : 'html';

    const path = `/${daCtx.org}${
      daCtx.pathname === '/' ? '' : daCtx.pathname
    }/${key}.${ext}`;

    combined.push({ path, name, ext });
    let childKeys = Object.keys(child);
    for (const childKey of childKeys) {
      if (childKey.startsWith('jcr:') || childKey.startsWith('cq:'))
        delete child[childKey];
    }
    childKeys = Object.keys(child);

    if (childKeys.length > 0) {
      const path = `/${daCtx.org}${
        daCtx.pathname === '/' ? '' : daCtx.pathname
      }/${key}`;
      combined.push({ path, name });
      continue;
    }
  }
  return combined;
}

export default async function listObjects(env, daCtx) {
  const config = getAEMConfig(env);

  const url = buildListUrl(config, daCtx);
  console.log("list", url);

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
