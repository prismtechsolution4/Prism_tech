const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function renderFinalLogo() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  const emblemBase64 = fs.readFileSync('public/brand/logo-icon.png').toString('base64');
  const emblemDataUrl = `data:image/png;base64,${emblemBase64}`;

  // SVG representation for public/brand/logo.svg
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 140" width="540" height="140">
  <!-- New TP Monogram Emblem -->
  <g id="emblem">
    <image href="${emblemDataUrl}" x="12" y="10" width="120" height="120" preserveAspectRatio="xMidYMid meet" />
  </g>

  <!-- Original Typography: PrismTech SOLUTIONS -->
  <g transform="translate(150, 0)">
    <!-- Wordmark "PrismTech" in bold modern sans -->
    <text 
      x="0" 
      y="78" 
      fill="#ffffff" 
      font-family="'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" 
      font-size="60" 
      font-weight="700" 
      letter-spacing="-0.025em"
    >PrismTech</text>

    <!-- Subtitle "S O L U T I O N S" in tracked uppercase electric blue -->
    <text 
      x="3" 
      y="110" 
      fill="#087FF5" 
      font-family="'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" 
      font-size="18" 
      font-weight="700" 
      letter-spacing="0.52em"
    >SOLUTIONS</text>
  </g>
</svg>`;

  fs.writeFileSync('public/brand/logo.svg', svgContent);
  console.log('Saved public/brand/logo.svg');

  // Render high-res transparent PNG (1080x280 at 2x => 2160x560)
  await page.setViewport({ width: 1080, height: 280, deviceScaleFactor: 2 });
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
          ${svgContent.replace('width="540"', 'width="1080"').replace('height="140"', 'height="280"')}
        </div>
      </body>
    </html>
  `, { waitUntil: 'networkidle2' });

  await new Promise(r => setTimeout(r, 1200));

  const logoBuf = await page.screenshot({ type: 'png', omitBackground: true });
  fs.writeFileSync('public/brand/logo-transparent.png', logoBuf);
  fs.writeFileSync('public/brand/prismtech-logo-clean.png', logoBuf);
  fs.writeFileSync('public/brand/prismtech-logo.png', logoBuf);
  console.log('Saved public/brand/logo-transparent.png (bytes:', logoBuf.length, ')');

  await browser.close();
}

renderFinalLogo().then(() => {
  console.log('Render complete!');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
