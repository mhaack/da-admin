export function buildBucketUrl(config) {
  return `${config.endpoint}/content.2.json`;
}

export function buildListUrl(config, { org, key }) {
  return `${config.endpoint}/content/${org}/${key}.2.json`;
}
