import getObject from '../aem-classic/get';

export default async function sourceHandler(req, env, daCtx) {

  console.log("sourceHandler", req.method, daCtx);

  if (req.method === 'OPTIONS') return { body: '', status: 204 };
  // if (req.method === 'DELETE') return deleteObject(env, daCtx);
  if (req.method === 'GET') return getObject(env, daCtx);
  // if (req.method === 'PUT') {
  //   const obj = await putHelper(req, env, daCtx);
  //   return putObject(env, daCtx, obj);
  // }
}
