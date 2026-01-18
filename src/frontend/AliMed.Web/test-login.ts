import { chromium } from 'playwright';

async function testLogin() {
  console.log('🚀 Starting login test...\n');
  
  const browser = await chromium.launch({ 
    headless: false,  // Show browser window
    slowMo: 500       // Slow down actions by 500ms for visibility
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Step 1: Go to login page
    console.log('📍 Step 1: Navigating to login page...');
    await page.goto('https://alimed.com.pl/login');
    await page.waitForLoadState('networkidle');
    console.log('✅ Login page loaded');
    console.log(`   Current URL: ${page.url()}\n`);
    
    // Step 2: Fill in credentials
    console.log('📍 Step 2: Filling in credentials...');
    await page.fill('input[type="email"]', 'demo@demo');
    await page.fill('input[type="password"]', '123456');
    console.log('✅ Credentials entered\n');
    
    // Step 3: Click login button
    console.log('📍 Step 3: Clicking login button...');
    
    // Find the submit button (it's a button with type="submit" in the form)
    const loginButton = page.locator('button[type="submit"]');
    await loginButton.click();
    console.log('✅ Login button clicked\n');
    
    // Step 4: Wait for navigation
    console.log('📍 Step 4: Waiting for redirect...');
    
    // Wait for URL to change (with timeout)
    try {
      await page.waitForURL('**/dashboard', { timeout: 10000 });
      console.log('✅ Successfully redirected to dashboard!');
      console.log(`   Final URL: ${page.url()}\n`);
      
      // Check localStorage
      const token = await page.evaluate(() => localStorage.getItem('alimed_token'));
      console.log(`📦 Token in localStorage: ${token ? 'YES (' + token.substring(0, 30) + '...)' : 'NO'}\n`);
      
      console.log('🎉 LOGIN TEST PASSED!\n');
      
    } catch (e) {
      console.log('❌ Redirect to dashboard failed!');
      console.log(`   Current URL: ${page.url()}`);
      
      // Check for errors on page
      const errorMessage = await page.locator('.bg-red-50').textContent().catch(() => null);
      if (errorMessage) {
        console.log(`   Error message: ${errorMessage}`);
      }
      
      // Check localStorage
      const token = await page.evaluate(() => localStorage.getItem('alimed_token'));
      console.log(`   Token in localStorage: ${token ? 'YES' : 'NO'}`);
      
      // Take screenshot
      await page.screenshot({ path: 'login-test-failed.png' });
      console.log('   Screenshot saved: login-test-failed.png\n');
      
      console.log('❌ LOGIN TEST FAILED!\n');
    }
    
    // Keep browser open for inspection
    console.log('⏳ Keeping browser open for 10 seconds for inspection...');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('💥 Test error:', error);
    await page.screenshot({ path: 'login-test-error.png' });
  } finally {
    await browser.close();
    console.log('🔒 Browser closed');
  }
}

testLogin();
