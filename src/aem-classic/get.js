function buildInput(env, { org, key }) {
  let filename = key;
  if (key === "metadata" || key === "redirects" || key == "placeholders") {
    filename = `${key}.json`;
  }
  if (!filename.includes('.json') && !filename.includes('.html')) {
    filename = `${key}.html`;
  }
  return `${env.AEM_AUTHOR}/content/${org}/${filename}`;
}


class ImgElementHandler {
  element(element) {
    const src = element.getAttribute('src');
    if (src?.startsWith('/content/dam')) {
      element.setAttribute(
        'src',
        `https://publish-p122525-e1200861.adobeaemcloud.com${src}`
      );
    }
  }
}

export default async function getObject(env, { org, key }) {;
  console.log("getObject", org, key);
  const url = buildInput(env, { org, key });
  console.log("get", url);

  try {
    let resp = await fetch(url, {
      headers: { Authorization: `Bearer ${env.AEM_TOKEN}` },
    });
    if (resp.headers.get('Content-Type').startsWith('text/html')) {
    resp = new HTMLRewriter()
      .on('img', new ImgElementHandler())
      .transform(resp);
    }
    return {
      body: await resp.text(),
      status: resp.status,
      contentType: resp.headers.get('Content-Type'),
    };
  } catch (e) {
    console.log(e);
    return { body: '', status: 404 };
  }
}
