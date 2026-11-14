const fs = require('fs');
const puppeteer = require('puppeteer-core');

async function renderAssets() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  // 1. Render logo-transparent.png at high res 1080x280
  const logoSvg = fs.readFileSync('public/brand/logo.svg', 'utf8');
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { background: transparent; overflow: hidden; }
        </style>
      </head>
      <body>
        <div style="width: 1080px; height: 280px;">
          ${logoSvg.replace('width="540"', 'width="1080"').replace('height="140"', 'height="280"')}
        </div>
      </body>
    </html>
  `, { waitUntil: 'domcontentloaded' });

  await new Promise(r => setTimeout(r, 1200));

  await page.setViewport({ width: 1080, height: 280, deviceScaleFactor: 2 });
  const logoBuf = await page.screenshot({ type: 'png', omitBackground: true });
  fs.writeFileSync('public/brand/logo-transparent.png', logoBuf);
  console.log('logo-transparent.png rendered, size:', logoBuf.length);

  // 2. Render logo-icon.png
  const iconSvg = fs.readFileSync('public/brand/logo-icon.svg', 'utf8');
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { background: transparent; overflow: hidden; }
        </style>
      </head>
      <body>
        <div style="width: 320px; height: 320px;">
          ${iconSvg.replace('width="160"', 'width="320"').replace('height="160"', 'height="320"')}
        </div>
      </body>
    </html>
  `, { waitUntil: 'domcontentloaded' });

  await new Promise(r => setTimeout(r, 500));
  await page.setViewport({ width: 320, height: 320, deviceScaleFactor: 2 });
  const iconBuf = await page.screenshot({ type: 'png', omitBackground: true });
  fs.writeFileSync('public/brand/logo-icon.png', iconBuf);
  console.log('logo-icon.png rendered, size:', iconBuf.length);

  // 3. Render favicon.ico (64x64 on dark background)
  await page.setViewport({ width: 64, height: 64, deviceScaleFactor: 1 });
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body style="margin:0; background: #0b0e13; overflow:hidden;">
        <div style="width:64px;height:64px;">
          ${iconSvg.replace('width="160"', 'width="64"').replace('height="160"', 'height="64"')}
        </div>
      </body>
    </html>
  `, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'public/favicon.ico' });
  console.log('favicon.ico generated');

  await browser.close();
}

renderAssets().then(() => {
  console.log('All assets successfully rendered!');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
