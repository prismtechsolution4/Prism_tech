const puppeteer = require('puppeteer-core');

async function test() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2200));

  // 1. Screenshot showing floating WhatsApp button
  await page.screenshot({ path: 'screenshots/whatsapp-button.png' });

  // 2. Click the WhatsApp button to open chatbot
  await page.click('button[aria-label="Chat with PrismTech on WhatsApp"]');
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'screenshots/whatsapp-chatbot-open.png' });

  // 3. Scroll to contact section
  await page.evaluate(() => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'screenshots/contact-section-whatsapp.png' });

  await browser.close();
  console.log('Screenshots taken successfully!');
}

test().catch(err => {
  console.error(err);
  process.exit(1);
});
