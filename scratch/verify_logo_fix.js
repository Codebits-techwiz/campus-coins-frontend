const puppeteer = require('puppeteer');

(async () => {
  console.log('Starting puppeteer browser verification...');
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1280, height: 800 }
  });

  const page = await browser.newPage();

  // 1. Visit Admin Login
  console.log('Navigating to admin login...');
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });

  // Login as Admin
  await page.type('input[type="email"]', 'admin@campuscoin.com');
  await page.type('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');

  await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});
  await new Promise(r => setTimeout(r, 2000));

  // 2. Go to Admin Site Content
  console.log('Navigating to Admin Site Content...');
  await page.goto('http://localhost:5173/admin/site-content', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({
    path: 'C:/Users/mk236/.gemini/antigravity-ide/brain/906f0095-a083-486e-91d7-e109c563526e/admin_branding_logo_fixed.png',
    fullPage: false
  });

  // 3. Go to Home Page
  console.log('Navigating to Home Page...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({
    path: 'C:/Users/mk236/.gemini/antigravity-ide/brain/906f0095-a083-486e-91d7-e109c563526e/home_navbar_logo_fixed.png',
    fullPage: false
  });

  await browser.close();
  console.log('Verification completed successfully!');
})();
