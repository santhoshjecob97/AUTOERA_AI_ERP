const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function main() {
  console.log('Launching installed system browser...');
  let browser;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
    console.log('Launched system Google Chrome.');
  } catch (e) {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
    console.log('Launched system Microsoft Edge.');
  }
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const consoleLogs = [];
  const pageErrors = [];
  const networkErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleLogs.push(`[CONSOLE ERROR] ${msg.text()}`);
    }
  });

  page.on('pageerror', err => {
    pageErrors.push(`[PAGE ERROR] ${err.message}`);
  });

  page.on('response', resp => {
    if (resp.status() >= 400) {
      networkErrors.push(`[HTTP ${resp.status()}] ${resp.url()}`);
    }
  });

  const url = 'https://autoera-ai-erp.vercel.app';
  console.log(`Navigating to ${url}...`);
  const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  console.log(`HTTP Status: ${response.status()}`);
  console.log(`Current URL: ${page.url()}`);
  console.log(`Page Title: ${await page.title()}`);

  const screenshotPath = path.join(__dirname, 'deployed_homepage_test.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`Screenshot saved to ${screenshotPath}`);

  // Inspect page content
  const bodyText = await page.innerText('body');
  console.log(`Body sample (first 300 chars): ${bodyText.slice(0, 300).replace(/\n+/g, ' ')}`);

  console.log(`Console Errors count: ${consoleLogs.length}`);
  consoleLogs.forEach(c => console.log('  ', c));
  console.log(`Page Errors count: ${pageErrors.length}`);
  pageErrors.forEach(p => console.log('  ', p));
  console.log(`Network Errors count: ${networkErrors.length}`);
  networkErrors.forEach(n => console.log('  ', n));

  await browser.close();
  console.log('Chromium closed.');
}

main().catch(err => {
  console.error('Playwright Test Failed:', err);
  process.exit(1);
});
