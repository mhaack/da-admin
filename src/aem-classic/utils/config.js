export default function getAEMConfig(env) {
  return {
    region: 'auto',
    endpoint: env.AEM_AUTHOR,
    credentials: {
      apiToken: env.AEM_TOKEN,
    },
  };
}
