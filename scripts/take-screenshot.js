const fs = require('fs');
const puppeteer = require('puppeteer-core');

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });

  // wait 2 seconds for preloader to finish and reveal hero
  await new Promise(r => setTimeout(r, 2500));

  await page.screenshot({ path: 'screenshots/hero-preview.png', fullPage: false });
  console.log('Saved screenshots/hero-preview.png');

  // Scroll down a bit to see the navbar state and why section
  await page.evaluate(() => window.scrollTo({ top: 700, behavior: 'instant' }));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'screenshots/scrolled-preview.png', fullPage: false });
  console.log('Saved screenshots/scrolled-preview.png');

  await browser.close();
}

capture().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
