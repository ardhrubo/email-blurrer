const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto('https://www.google.com');

  // get the outerHTML of the login / profile area
  const headerHtml = await page.evaluate(() => {
    const el = document.querySelector('a[href*="SignOutOptions"], a[href*="ServiceLogin"]');
    return el ? el.outerHTML : 'Not found';
  });

  console.log("Header HTML:");
  console.log(headerHtml);

  await browser.close();
})();
