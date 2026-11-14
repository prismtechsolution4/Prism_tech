const puppeteer = require('puppeteer-core');

async function test() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  // 1. Screenshot of Navbar with WhatsApp & Book a free consultation
  await page.screenshot({ path: 'screenshots/navbar-updated.png' });

  // 2. Scroll to Contact section
  await page.evaluate(() => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'screenshots/contact-heading-updated.png' });

  // 3. Fill the contact form and submit to see the updated "WhatsApp" button
  await page.type('#name', 'Tahaxxxviii Muzamil');
  await page.type('#email', 'tahamuzamil07@gmail.com');
  await page.type('#phone', '03198669833');
  await page.type('#company', 'PrismTech Client');
  await page.type('#message', 'I want to book a free consultation for an AI project.');
  await page.click('button[type="submit"]');

  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'screenshots/contact-success-whatsapp-button.png' });

  await browser.close();
  console.log('All verification screenshots captured!');
}

test().catch(err => {
  console.error(err);
  process.exit(1);
});
