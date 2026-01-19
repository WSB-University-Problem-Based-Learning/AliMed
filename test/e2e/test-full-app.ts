import { chromium, Page, Locator } from 'playwright';

const BASE_URL = 'https://alimed.com.pl';
const CREDENTIALS = { email: 'demo@demo', password: '123456' };

interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL';
  error?: string;
}

const results: TestResult[] = [];

async function test(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    results.push({ name, status: 'PASS' });
    console.log(`✅ ${name}`);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    results.push({ name, status: 'FAIL', error: errMsg });
    console.log(`❌ ${name}: ${errMsg}`);
  }
}

async function assertVisible(locator: Locator, timeout = 5000) {
  const visible = await locator.isVisible().catch(() => false);
  if (!visible) {
    await locator.waitFor({ state: 'visible', timeout }).catch(() => {
      throw new Error('Element not visible');
    });
  }
}

async function assertUrl(page: Page, pattern: string) {
  const url = page.url();
  if (!url.includes(pattern)) {
    throw new Error(`URL "${url}" does not contain "${pattern}"`);
  }
}

async function runAllTests() {
  console.log('🚀 Starting comprehensive UI tests...\n');
  console.log('='.repeat(60) + '\n');

  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 150
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  const consoleErrors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  try {
    // ========== PUBLIC PAGES ==========
    console.log('📋 TESTING PUBLIC PAGES\n');

    await test('Homepage loads', async () => {
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
    });

    await test('Homepage has logo', async () => {
      await assertVisible(page.locator('img[alt="AliMed"]').first());
    });

    await test('Homepage has navigation links', async () => {
      await assertVisible(page.locator('nav a, header a').first());
    });

    await test('Homepage has hero section', async () => {
      await assertVisible(page.locator('main, [class*="hero"], h1, h2').first());
    });

    await test('Login page loads', async () => {
      await page.goto(`${BASE_URL}/login`);
      await page.waitForLoadState('networkidle');
      await assertUrl(page, '/login');
    });

    await test('Login page has email input', async () => {
      await assertVisible(page.locator('input[type="email"]'));
    });

    await test('Login page has password input', async () => {
      await assertVisible(page.locator('input[type="password"]'));
    });

    await test('Login page has submit button', async () => {
      await assertVisible(page.locator('button[type="submit"]'));
    });

    await test('Login page has GitHub login button', async () => {
      await assertVisible(page.locator('button:has-text("GitHub")'));
    });

    await test('Login page has register link', async () => {
      await assertVisible(page.locator('a[href*="register"]'));
    });

    await test('Register page loads', async () => {
      await page.goto(`${BASE_URL}/register`);
      await page.waitForLoadState('networkidle');
      await assertUrl(page, '/register');
    });

    await test('Register page has email field', async () => {
      await assertVisible(page.locator('input[type="email"]'));
    });

    await test('Register page has password field', async () => {
      await assertVisible(page.locator('input[type="password"]').first());
    });

    // ========== LOGIN FLOW ==========
    console.log('\n📋 TESTING LOGIN FLOW\n');

    await test('Clear localStorage and go to login', async () => {
      await page.goto(`${BASE_URL}/login`);
      await page.evaluate(() => localStorage.clear());
      await page.reload();
      await page.waitForLoadState('networkidle');
    });

    await test('Fill login form', async () => {
      await page.fill('input[type="email"]', CREDENTIALS.email);
      await page.fill('input[type="password"]', CREDENTIALS.password);
    });

    await test('Submit login and redirect to dashboard', async () => {
      await page.click('button[type="submit"]');
      await page.waitForURL('**/dashboard', { timeout: 10000 });
      await assertUrl(page, '/dashboard');
    });

    await test('Token saved in localStorage', async () => {
      const token = await page.evaluate(() => localStorage.getItem('alimed_token'));
      if (!token) throw new Error('No token in localStorage');
    });

    // ========== DASHBOARD ==========
    console.log('\n📋 TESTING DASHBOARD\n');

    await test('Dashboard has header', async () => {
      await assertVisible(page.locator('header').first());
    });

    await test('Dashboard has logo in header', async () => {
      await assertVisible(page.locator('header img, img[alt="AliMed"]').first());
    });

    await test('Dashboard has logout button', async () => {
      await assertVisible(page.locator('button:has-text("Wyloguj"), button:has-text("Logout")').first());
    });

    await test('Dashboard has action cards', async () => {
      const cards = page.locator('main button[class*="rounded"], main div[class*="rounded-xl"]');
      const count = await cards.count();
      if (count < 2) throw new Error(`Only ${count} cards found, expected at least 2`);
    });

    await test('Dashboard has visits table or section', async () => {
      await assertVisible(page.locator('table, [class*="wizyty"], h2').first());
    });

    // ========== MOJE WIZYTY ==========
    console.log('\n📋 TESTING MOJE WIZYTY PAGE\n');

    await test('Navigate to Moje Wizyty', async () => {
      await page.goto(`${BASE_URL}/moje-wizyty`);
      await page.waitForLoadState('networkidle');
      await assertUrl(page, '/moje-wizyty');
    });

    await test('Moje Wizyty has heading', async () => {
      await assertVisible(page.locator('h1, h2').first());
    });

    await test('Moje Wizyty has filter buttons', async () => {
      await assertVisible(page.locator('button').first());
    });

    // ========== UMÓW WIZYTĘ ==========
    console.log('\n📋 TESTING UMÓW WIZYTĘ PAGE\n');

    await test('Navigate to Umów Wizytę', async () => {
      await page.goto(`${BASE_URL}/umow-wizyte`);
      await page.waitForLoadState('networkidle');
      await assertUrl(page, '/umow-wizyte');
    });

    await test('Umów Wizytę has heading', async () => {
      await assertVisible(page.locator('h1').first());
    });

    await test('Umów Wizytę has specialization filter', async () => {
      await assertVisible(page.locator('select').first());
    });

    await test('Umów Wizytę has doctor cards', async () => {
      const doctors = page.locator('button[class*="border"]');
      const count = await doctors.count();
      if (count < 1) throw new Error('No doctor cards found');
    });

    await test('Umów Wizytę has date picker', async () => {
      await assertVisible(page.locator('input[type="date"]'));
    });

    // ========== DOKUMENTY ==========
    console.log('\n📋 TESTING DOKUMENTY PAGE\n');

    await test('Navigate to Dokumenty', async () => {
      await page.goto(`${BASE_URL}/dokumenty`);
      await page.waitForLoadState('networkidle');
      await assertUrl(page, '/dokumenty');
    });

    await test('Dokumenty has heading', async () => {
      await assertVisible(page.locator('h1, h2').first());
    });

    await test('Dokumenty has search input', async () => {
      await assertVisible(page.locator('input[type="text"]').first());
    });

    await test('Dokumenty has filter dropdown', async () => {
      await assertVisible(page.locator('select').first());
    });

    await test('Dokumenty has statistics cards', async () => {
      const cards = page.locator('[class*="rounded-lg"], [class*="card"]');
      const count = await cards.count();
      if (count < 2) throw new Error(`Only ${count} stat cards found`);
    });

    // ========== MOJE DANE ==========
    console.log('\n📋 TESTING MOJE DANE PAGE\n');

    await test('Navigate to Moje Dane', async () => {
      await page.goto(`${BASE_URL}/moje-dane`);
      await page.waitForLoadState('networkidle');
      await assertUrl(page, '/moje-dane');
    });

    await test('Moje Dane has heading', async () => {
      await assertVisible(page.locator('h1').first());
    });

    await test('Moje Dane has form', async () => {
      await assertVisible(page.locator('form').first());
    });

    await test('Moje Dane has name inputs', async () => {
      const inputs = page.locator('input[type="text"]');
      const count = await inputs.count();
      if (count < 2) throw new Error('Not enough form inputs');
    });

    await test('Moje Dane has email input', async () => {
      await assertVisible(page.locator('input[type="email"]'));
    });

    await test('Moje Dane has edit button', async () => {
      await assertVisible(page.locator('button:has-text("Edytuj"), button:has-text("Edit")').first());
    });

    // ========== API ENDPOINTS ==========
    console.log('\n📋 TESTING API ENDPOINTS\n');

    await test('API: Login endpoint works', async () => {
      const response = await page.request.post(`${BASE_URL}/api/auth/login`, {
        data: { email: CREDENTIALS.email, password: CREDENTIALS.password }
      });
      if (!response.ok()) throw new Error(`Login API returned ${response.status()}`);
    });

    await test('API: Get Lekarze works', async () => {
      const token = await page.evaluate(() => localStorage.getItem('alimed_token'));
      const response = await page.request.get(`${BASE_URL}/api/authorizedendpoint/lekarze`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok()) throw new Error(`Lekarze API returned ${response.status()}`);
    });

    await test('API: Get Wizyty works', async () => {
      const token = await page.evaluate(() => localStorage.getItem('alimed_token'));
      const response = await page.request.get(`${BASE_URL}/api/wizyty/moje-wizyty`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok()) throw new Error(`Wizyty API returned ${response.status()}`);
    });

    await test('API: Get Dokumenty works', async () => {
      const token = await page.evaluate(() => localStorage.getItem('alimed_token'));
      const response = await page.request.get(`${BASE_URL}/api/dokumenty`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok()) throw new Error(`Dokumenty API returned ${response.status()}`);
    });

    // ========== RESPONSIVE ==========
    console.log('\n📋 TESTING RESPONSIVE DESIGN\n');

    await test('Mobile view (375px) - Login page', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(`${BASE_URL}/login`);
      await page.waitForLoadState('networkidle');
      await assertVisible(page.locator('button[type="submit"]'));
    });

    await test('Mobile view - Dashboard', async () => {
      await page.goto(`${BASE_URL}/dashboard`);
      await page.waitForLoadState('networkidle');
      await assertVisible(page.locator('header').first());
    });

    await test('Tablet view (768px) - Dashboard', async () => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(`${BASE_URL}/dashboard`);
      await page.waitForLoadState('networkidle');
      await assertVisible(page.locator('header').first());
    });

    await page.setViewportSize({ width: 1920, height: 1080 });

    // ========== LOGOUT ==========
    console.log('\n📋 TESTING LOGOUT\n');

    await test('Click logout button', async () => {
      await page.goto(`${BASE_URL}/dashboard`);
      await page.waitForLoadState('networkidle');
      const logoutBtn = page.locator('button:has-text("Wyloguj"), button:has-text("Logout")').first();
      await logoutBtn.click();
      await page.waitForTimeout(1000);
    });

    await test('Token cleared after logout', async () => {
      const token = await page.evaluate(() => localStorage.getItem('alimed_token'));
      if (token) throw new Error('Token still exists after logout');
    });

    // ========== CONSOLE ERRORS ==========
    console.log('\n📋 CHECKING CONSOLE ERRORS\n');

    await test('No critical JavaScript errors', async () => {
      const criticalErrors = consoleErrors.filter(e => 
        !e.includes('favicon') && 
        !e.includes('autocomplete') &&
        !e.includes('DevTools') &&
        !e.includes('404')
      );
      if (criticalErrors.length > 0) {
        console.log('   Console errors found:', criticalErrors);
        throw new Error(`${criticalErrors.length} JS errors`);
      }
    });

  } catch (error) {
    console.error('\n💥 Test suite error:', error);
  } finally {
    // ========== SUMMARY ==========
    console.log('\n' + '='.repeat(60));
    console.log('\n📊 TEST SUMMARY\n');
    
    const passed = results.filter(r => r.status === 'PASS').length;
    const failed = results.filter(r => r.status === 'FAIL').length;
    const total = results.length;
    
    console.log(`Total: ${total} | ✅ Passed: ${passed} | ❌ Failed: ${failed}`);
    console.log(`Success rate: ${((passed / total) * 100).toFixed(1)}%\n`);
    
    if (failed > 0) {
      console.log('❌ Failed tests:');
      results.filter(r => r.status === 'FAIL').forEach(r => {
        console.log(`   • ${r.name}: ${r.error}`);
      });
    }
    
    console.log('\n⏳ Keeping browser open for 5 seconds...');
    await page.waitForTimeout(5000);
    
    await browser.close();
    console.log('🔒 Browser closed');
  }
}

runAllTests();
