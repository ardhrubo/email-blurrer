const https = require('https');

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode && response.statusCode >= 400) {
        reject(new Error(`Request failed with status ${response.statusCode}`));
        response.resume();
        return;
      }

      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => {
        body += chunk;
      });
      response.on('end', () => resolve(body));
    }).on('error', reject);
  });
}

(async () => {
  try {
    const html = await fetchPage('https://www.google.com');

    // get the outerHTML of the login / profile area
    const match = html.match(/<a\b[^>]*href="[^"]*(?:SignOutOptions|ServiceLogin)[^"]*"[^>]*>[\s\S]*?<\/a>/i);
    const headerHtml = match ? match[0] : 'Not found';

    console.log("Header HTML:");
    console.log(headerHtml);
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
})();
