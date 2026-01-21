import { chromium, Page, Locator } from 'playwright';

const BASE_URL = 'https://alimed.com.pl';

// Generate random user data for each run
const TIMESTAMP = Date.now();
const NEW_USER = {
  email: `test${TIMESTAMP}@example.com`,
  username: `testuser${TIMESTAMP}`,
  password: 'TestPassword123!',
  firstName: 'Test',
  lastName: 'User',
  pesel: '90010112345', // Dummy PESEL
  phone: '123456789'
};

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
  console.log('🚀 Starting E2E tests with REGISTRATION flow...\n');
  console.log(`👤 Creating User: ${NEW_USER.email} / ${NEW_USER.username}`);
  console.log('='.repeat(60) + '\n');

  const browser = await chromium.launch({
    headless: false, // Keep visible for debugging
    slowMo: 100
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: true
  });
  const page = await context.newPage();

  const consoleErrors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  try {
    // ========== REGISTRATION FLOW ==========
    console.log('📋 TESTING REGISTRATION\n');

    await test('Navigate to Register', async () => {
      await page.goto(`${BASE_URL}/register`);
      await page.waitForLoadState('networkidle');
      await assertUrl(page, '/register');
    });

    await test('Step 1: Fill Account Details', async () => {
      // Step 1 fields
      await page.fill('input[name="email"]', NEW_USER.email);
      await page.fill('input[name="username"]', NEW_USER.username);
      await page.fill('input[name="password"]', NEW_USER.password);

      // Confirm password (no name, usually the second password input)
      const passwordInputs = page.locator('input[type="password"]');
      await passwordInputs.nth(1).fill(NEW_USER.password);

      // Click Next
      await page.click('button:has-text("Dalej"), button:has-text("Next")');
    });

    await test('Step 2: Fill Personal Details', async () => {
      // Step 2 fields - Wait for animation/transition
      await page.waitForSelector('input[name="firstName"]');

      await page.fill('input[name="firstName"]', NEW_USER.firstName);
      await page.fill('input[name="lastName"]', NEW_USER.lastName);
      await page.fill('input[name="pesel"]', NEW_USER.pesel);
      await page.fill('input[name="dataUrodzenia"]', '1990-01-01');

      // Address
      await page.fill('input[name="ulica"]', 'Testowa');
      await page.fill('input[name="numerDomu"]', '123');
      await page.fill('input[name="kodPocztowy"]', '00-123');
      await page.fill('input[name="miasto"]', 'Warszawa');

      // Submit
      await page.click('button[type="submit"]');
    });

    await test('Redirects to Dashboard after Registration', async () => {
      // Should redirect to dashboard automatically
      await page.waitForURL('**/dashboard', { timeout: 15000 });
      await assertUrl(page, '/dashboard');
    });

    // ========== DASHBOARD VERIFICATION ==========
    console.log('\n📋 TESTING DASHBOARD ACCESS (NEW USER)\n');

    await test('Dashboard loads correctly', async () => {
      await assertVisible(page.locator('header').first());
      // Check for welcome message
      await assertVisible(page.locator(`text=${NEW_USER.username}`).first());
    });

    await test('Protected Route Access: Moje Wizyty', async () => {
      await page.goto(`${BASE_URL}/moje-wizyty`);
      await assertUrl(page, '/moje-wizyty');
      // Should NOT redirect to login
      const url = page.url();
      if (url.includes('/login')) throw new Error('Redirected to login from protected route!');
    });

    await test('Protected Route Access: Moje Dane', async () => {
      await page.goto(`${BASE_URL}/moje-dane`);
      await assertUrl(page, '/moje-dane');

      // Verify data persists
      const emailField = page.locator('input[type="email"]');
      await expectValue(emailField, NEW_USER.email);
    });

    // ========== LOGOUT & RE-LOGIN ==========
    console.log('\n📋 TESTING LOGOUT & RE-LOGIN\n');

    await test('Logout works', async () => {
      await page.goto(`${BASE_URL}/dashboard`);
      await page.click('button:has-text("Wyloguj"), button:has-text("Logout")');
      await page.waitForURL('**/');
    });

    await test('Login with new credentials', async () => {
      await page.goto(`${BASE_URL}/login`);

      // LoginPage uses plain text for email input as discovered earlier
      await page.fill('input[type="text"]', NEW_USER.email);
      await page.fill('input[type="password"]', NEW_USER.password);
      await page.click('button[type="submit"]');

      await page.waitForURL('**/dashboard');
      await assertUrl(page, '/dashboard');
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

    await browser.close();
  }
}

// Helper
async function expectValue(locator: Locator, expected: string) {
  const value = await locator.inputValue();
  if (!value.includes(expected)) {
    throw new Error(`Expected value containing "${expected}", got "${value}"`);
  }
}

runAllTests();
