const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 1024 });

  const svgContent = fs.readFileSync('icon.svg', 'utf8');
  // Need to encode correctly
  const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;

  await page.setContent(`
    <style>body { margin: 0; background: transparent; }</style>
    <img id="img" src="${dataUrl}" width="1024" height="1024" />
  `);
  
  await page.waitForSelector('#img');
  await page.screenshot({ path: 'icon.png', type: 'png', omitBackground: true });
  
  await browser.close();
})();
