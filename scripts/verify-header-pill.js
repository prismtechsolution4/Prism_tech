const puppeteer = require('puppeteer-core');

async function test() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  // wait 5 seconds (past the old 4s timer to confirm no popup pill appears)
  await new Promise(r => setTimeout(r, 5200));

  // 1. Screenshot of clean Header without WhatsApp button
  await page.screenshot({ path: 'screenshots/header-clean.png' });

  // 2. Screenshot of bottom right corner
  await page.screenshot({ path: 'screenshots/floating-no-pill.png' });

  await browser.close();
  console.log('Screenshots taken successfully!');
}

test().catch(err => {
  console.error(err);
  process.exit(1);
});
