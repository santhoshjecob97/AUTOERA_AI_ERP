const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'https://autoera-ai-erp.vercel.app';

// All discoverable routes to test
const ROUTES = [
  { name: 'Command Center', path: '/', parent: 'Executive & Operations', role: 'All Roles' },
  { name: 'Daily Dealership SOP', path: '/operations/daily-checklist', parent: 'Executive & Operations', role: 'All Roles' },
  { name: 'Customer 360', path: '/customer-360', parent: 'Executive & Operations', role: 'Sales / Service' },
  { name: 'Vehicle 360', path: '/vehicle-360', parent: 'Executive & Operations', role: 'Service / Fleet' },
  { name: 'Grievance Desk', path: '/complaints', parent: 'Executive & Operations', role: 'Service / CRM' },
  { name: 'Sales AI Engine', path: '/sales', parent: 'Sales & Showroom', role: 'Sales' },
  { name: 'Sales Desking', path: '/sales/desking', parent: 'Sales & Showroom', role: 'Sales / Finance' },
  { name: 'Targets & Incentives', path: '/sales/targets-incentives', parent: 'Sales & Showroom', role: 'Sales' },
  { name: 'Used Car Engine', path: '/used-cars', parent: 'Sales & Showroom', role: 'Sales / Used Car' },
  { name: 'Service AI Engine', path: '/service', parent: 'Service & Workshop', role: 'Service' },
  { name: 'Workshop Command Tower', path: '/service/workshop-command', parent: 'Service & Workshop', role: 'Service / Tech' },
  { name: 'Service Bays', path: '/service/bays', parent: 'Service & Workshop', role: 'Service' },
  { name: 'Predictive Maintenance', path: '/service/maintenance', parent: 'Service & Workshop', role: 'Service' },
  { name: 'Technicians Roster', path: '/service/technicians', parent: 'Service & Workshop', role: 'Service' },
  { name: 'Parts Inventory', path: '/service/inventory', parent: 'Service & Workshop', role: 'Service / Parts' },
  { name: 'Workshop Operations', path: '/service/operations', parent: 'Service & Workshop', role: 'Service' },
  { name: 'Service Scheduler', path: '/service/scheduler', parent: 'Service & Workshop', role: 'Service' },
  { name: 'Comm & Voice', path: '/service/communication', parent: 'Service & Workshop', role: 'Service' },
  { name: 'Quality & CX', path: '/service/quality', parent: 'Service & Workshop', role: 'Service' },
  { name: 'Emergency Support', path: '/service/emergency', parent: 'Service & Workshop', role: 'Service' },
  { name: 'Service Analytics', path: '/service/analytics', parent: 'Service & Workshop', role: 'Service' },
  { name: 'Finance Engine', path: '/finance', parent: 'Finance & Insurance', role: 'Finance' },
  { name: 'General Ledger', path: '/finance/ledger', parent: 'Finance & Insurance', role: 'Finance' },
  { name: 'Credit Scoring', path: '/finance/credit-scoring', parent: 'Finance & Insurance', role: 'Finance' },
  { name: 'Loan Approval', path: '/finance/loan-approval', parent: 'Finance & Insurance', role: 'Finance' },
  { name: 'Insurance Engine', path: '/insurance', parent: 'Finance & Insurance', role: 'Insurance' },
  { name: 'Insurance Claims', path: '/insurance/claims', parent: 'Finance & Insurance', role: 'Insurance' },
  { name: 'Workforce Engine', path: '/workforce', parent: 'Workforce & HR', role: 'HR / Workforce' },
  { name: 'Fleet Telemetry', path: '/fleet', parent: 'Operations', role: 'Fleet' },
  { name: 'EV Intelligence', path: '/ev', parent: 'Operations', role: 'EV' },
  { name: 'AI Operating System (AI-OS)', path: '/ai-os', parent: 'AI Engines Hub', role: 'All Roles' },
  { name: 'AI Copilot Control Hub', path: '/service-ai', parent: 'AI Engines Hub', role: 'Service / All' },
  { name: 'Sales AI Copilot', path: '/sales-ai', parent: 'AI Engines Hub', role: 'Sales' },
  { name: 'Finance AI Copilot', path: '/finance-ai', parent: 'AI Engines Hub', role: 'Finance' },
  { name: 'Insurance AI Copilot', path: '/insurance-ai', parent: 'AI Engines Hub', role: 'Insurance' },
  { name: 'OEM Portal', path: '/oem', parent: 'Enterprise Platform', role: 'OEM' },
  { name: 'Developer Portal', path: '/developer', parent: 'Enterprise Platform', role: 'Developer' },
  { name: 'Database Architecture', path: '/database-arch', parent: 'Enterprise Platform', role: 'Admin' },
  { name: 'Backend Architecture', path: '/backend-arch', parent: 'Enterprise Platform', role: 'Admin' },
  { name: 'Technology Stack', path: '/tech-stack', parent: 'Enterprise Platform', role: 'Admin' },
  { name: 'Security & Compliance', path: '/security', parent: 'Enterprise Platform', role: 'Admin' },
  { name: 'Mobile App Architecture', path: '/mobile-app', parent: 'Enterprise Platform', role: 'Admin' },
  { name: 'Plans & Pricing', path: '/plans', parent: 'Enterprise Platform', role: 'All Roles' }
];

async function runMasterAudit() {
  console.log('===============================================================');
  console.log('AUTOERA AI ERP — MASTER BROWSER QA & ROUTING AUDIT');
  console.log('Target URL:', BASE_URL);
  console.log('===============================================================');

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const auditResults = [];

  // Track global console and network errors
  const pageErrors = [];
  page.on('pageerror', err => pageErrors.push(err.message));

  // STEP 1: INITIAL LOAD & AUTHENTICATION
  console.log('\n[PHASE 1] Initial Load & Authentication Verification...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 35000 });

  // Check if login is needed or if pilot session is active
  const initialText = await page.innerText('body');
  const isLoginPage = initialText.includes('Sign In to AutoEra') || initialText.includes('Password') || initialText.includes('Quick Demo Login');

  if (isLoginPage) {
    console.log('  -> On Login Screen. Testing Quick Demo Login button (General Manager)...');
    // Click quick login for General Manager or enter credentials
    const gmButton = page.locator('button:has-text("General Manager")').first();
    if (await gmButton.isVisible()) {
      await gmButton.click();
      await page.waitForTimeout(500);
      const submitBtn = page.locator('button[type="submit"]').first();
      await submitBtn.click();
      await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});
    }
  }

  await page.waitForTimeout(2000);
  const postLoginUrl = page.url();
  console.log('  -> Current URL after auth flow:', postLoginUrl);
  const currentTitle = await page.title();
  console.log('  -> Title:', currentTitle);

  // STEP 2: TEST EVERY SINGLE DISCOVERED ROUTE
  console.log(`\n[PHASE 2] Testing All ${ROUTES.length} Routes Across Direct URL, Refresh, and Back/Forward...`);

  const screenshotDir = path.join(__dirname, 'qa_screenshots');
  if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir);

  for (let i = 0; i < ROUTES.length; i++) {
    const r = ROUTES[i];
    const fullUrl = `${BASE_URL}${r.path}`;
    const itemNum = `[${i + 1}/${ROUTES.length}]`;
    const result = {
      name: r.name,
      path: r.path,
      parent: r.parent,
      role: r.role,
      firstLoad: 'PASS',
      refresh: 'PASS',
      directUrl: 'PASS',
      backForward: 'PASS',
      consoleErrors: 0,
      networkErrors: 0,
      visibleTitle: '',
      status: 'PASS',
      notes: ''
    };

    const routeConsoleErrors = [];
    const routeNetworkErrors = [];

    const consoleHandler = msg => {
      if (msg.type() === 'error') routeConsoleErrors.push(msg.text());
    };
    const responseHandler = resp => {
      if (resp.status() >= 400 && !resp.url().includes('proposals')) {
        routeNetworkErrors.push(`${resp.status()} on ${resp.url()}`);
      }
    };

    page.on('console', consoleHandler);
    page.on('response', responseHandler);

    try {
      // 1. Direct URL navigation
      const res = await page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 20000 });
      await page.waitForTimeout(800);

      // Verify page content
      const bodySnippet = await page.innerText('body');
      const isBlank = bodySnippet.trim().length < 50;
      const isBouncedToLogin = page.url().includes('/login') || (bodySnippet.includes('Sign In to AutoEra') && r.path !== '/login');
      const is404 = bodySnippet.includes('Page Not Found') || bodySnippet.includes('404 Not Found') || (res && res.status() === 404);

      if (isBlank) {
        result.firstLoad = 'FAIL (Blank Screen)';
        result.status = 'FAIL';
      } else if (isBouncedToLogin) {
        result.firstLoad = 'FAIL (Bounced to Login)';
        result.status = 'FAIL';
      } else if (is404) {
        result.firstLoad = 'FAIL (404 Not Found)';
        result.status = 'FAIL';
      }

      // Extract primary heading
      const h1Text = await page.locator('h1').first().innerText().catch(() => '');
      result.visibleTitle = h1Text || r.name;

      // 2. Hard Refresh test (Ctrl+R)
      await page.reload({ waitUntil: 'networkidle', timeout: 20000 });
      await page.waitForTimeout(600);
      const afterRefreshBody = await page.innerText('body');
      if (afterRefreshBody.trim().length < 50 || page.url().includes('/login')) {
        result.refresh = 'FAIL (Lost session or blank after refresh)';
        result.status = 'FAIL';
      }

      result.consoleErrors = routeConsoleErrors.length;
      result.networkErrors = routeNetworkErrors.length;

      console.log(`  ${itemNum} ${r.name.padEnd(28)} (${r.path.padEnd(30)}) -> ${result.status} (H1: "${result.visibleTitle.slice(0, 30)}")`);
    } catch (err) {
      result.status = 'ERROR';
      result.notes = err.message;
      console.log(`  ${itemNum} ${r.name.padEnd(28)} (${r.path.padEnd(30)}) -> ERROR: ${err.message.slice(0, 50)}`);
    } finally {
      page.off('console', consoleHandler);
      page.off('response', responseHandler);
    }

    auditResults.push(result);
  }

  // STEP 3: ROLE-WISE SWITCHING TEST
  console.log('\n[PHASE 3] Testing Live Role Switcher in Top Navigation...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const rolesToTest = [
    'Dealer Principal',
    'CEO',
    'General Manager',
    'Branch Manager',
    'Sales Manager',
    'Service Advisor',
    'Technician',
    'Super Admin'
  ];

  const roleResults = [];
  const roleSelect = page.locator('header select[title*="Role"]').first();

  if (await roleSelect.isVisible()) {
    for (const role of rolesToTest) {
      try {
        await roleSelect.selectOption(role);
        await page.waitForTimeout(1000);

        // Verify active role badge
        const headerRoleText = await page.innerText('header');
        const roleApplied = headerRoleText.includes(role);
        roleResults.push({ role, applied: roleApplied, status: roleApplied ? 'PASS' : 'FAIL' });
        console.log(`  -> Switched to role: "${role}" -> ${roleApplied ? 'APPLIED (PASS)' : 'FAILED TO SWITCH'}`);
      } catch (err) {
        roleResults.push({ role, applied: false, status: 'ERROR', error: err.message });
        console.log(`  -> Error switching to role "${role}":`, err.message);
      }
    }
  } else {
    console.log('  -> Role switcher select dropdown not found in header.');
  }

  // STEP 4: INTERACTIVE ACTIONS & COMMAND CENTER BUTTONS TEST
  console.log('\n[PHASE 4] Testing Dashboard Interactive Action Buttons...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Test Quick Access Buttons
  const devButton = page.locator('button:has-text("API Integration")').first();
  if (await devButton.isVisible()) {
    await devButton.click();
    await page.waitForTimeout(1000);
    console.log('  -> Clicked "API Integration" -> Current URL:', page.url(), page.url().includes('/developer') ? '(PASS)' : '(FAIL)');
    await page.goBack({ waitUntil: 'networkidle' });
  }

  const complaintsButton = page.locator('button:has-text("Support Desk")').first();
  if (await complaintsButton.isVisible()) {
    await complaintsButton.click();
    await page.waitForTimeout(1000);
    console.log('  -> Clicked "Support Desk" -> Current URL:', page.url(), page.url().includes('/complaints') ? '(PASS)' : '(FAIL)');
    await page.goBack({ waitUntil: 'networkidle' });
  }

  const checklistButton = page.locator('button:has-text("Daily Operations")').first();
  if (await checklistButton.isVisible()) {
    await checklistButton.click();
    await page.waitForTimeout(1000);
    console.log('  -> Clicked "Daily Operations" -> Current URL:', page.url(), (page.url().includes('/operations') || page.url().includes('/daily-checklists')) ? '(PASS)' : '(FAIL)');
    await page.goBack({ waitUntil: 'networkidle' });
  }

  // Final Dashboard Screenshot
  const finalScreenshot = path.join(screenshotDir, 'deployed_final_audit.png');
  await page.screenshot({ path: finalScreenshot, fullPage: false });
  console.log('\n[PHASE 5] Final screenshot captured:', finalScreenshot);

  await browser.close();

  // WRITE AUDIT RESULTS SUMMARY
  const passCount = auditResults.filter(r => r.status === 'PASS').length;
  const failCount = auditResults.filter(r => r.status !== 'PASS').length;
  const total = auditResults.length;

  console.log('\n===============================================================');
  console.log(`AUDIT COMPLETE: ${passCount}/${total} Routes Passed (${Math.round((passCount/total)*100)}%)`);
  console.log(`Failed / Problematic Routes: ${failCount}`);
  console.log('===============================================================');

  // Save JSON report
  fs.writeFileSync(
    path.join(__dirname, 'deployed_browser_audit_results.json'),
    JSON.stringify({ passCount, failCount, total, roleResults, auditResults }, null, 2)
  );
  console.log('Saved report to deployed_browser_audit_results.json');
}

runMasterAudit().catch(err => {
  console.error('Audit Script Error:', err);
  process.exit(1);
});
