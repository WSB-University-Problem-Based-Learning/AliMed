import { chromium } from 'playwright';

async function testLogin() {
  console.log('🚀 Starting detailed login test...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 300
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Listen to console logs
  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`);
  });
  
  // Listen to page errors
  page.on('pageerror', error => {
    console.log(`[PAGE ERROR] ${error.message}`);
  });
  
  // Listen to all network requests
  page.on('response', response => {
    if (response.url().includes('/api/')) {
      console.log(`[API] ${response.status()} ${response.url()}`);
    }
  });

  // Listen to navigation
  page.on('framenavigated', frame => {
    if (frame === page.mainFrame()) {
      console.log(`[NAVIGATION] URL changed to: ${frame.url()}`);
    }
  });
  
  try {
    // Step 1: Go to login page
    console.log('📍 Step 1: Navigating to login page...');
    await page.goto('https://alimed.com.pl/login');
    await page.waitForLoadState('networkidle');
    console.log(`   Current URL: ${page.url()}\n`);
    
    // Check initial localStorage
    const initialToken = await page.evaluate(() => localStorage.getItem('alimed_token'));
    console.log(`📦 Initial token in localStorage: ${initialToken ? 'YES' : 'NO'}\n`);
    
    // Clear any existing token
    await page.evaluate(() => {
      localStorage.removeItem('alimed_token');
      localStorage.removeItem('alimed_user');
      localStorage.removeItem('alimed_demo_mode');
    });
    console.log('🧹 Cleared localStorage\n');
    
    // Reload to ensure clean state
    await page.reload();
    await page.waitForLoadState('networkidle');
    console.log('🔄 Page reloaded with clean state\n');
    
    // Step 2: Fill in credentials
    console.log('📍 Step 2: Filling in credentials...');
    await page.fill('input[type="email"]', 'demo@demo');
    await page.fill('input[type="password"]', '123456');
    console.log('✅ Credentials entered\n');
    
    // Step 3: Click login button and monitor what happens
    console.log('📍 Step 3: Clicking login button...');
    
    // Set up a promise to wait for any navigation
    const navigationPromise = page.waitForEvent('framenavigated', { timeout: 15000 }).catch(() => null);
    
    const loginButton = page.locator('button[type="submit"]');
    await loginButton.click();
    console.log('✅ Login button clicked\n');
    
    // Wait a bit for any async operations
    await page.waitForTimeout(3000);
    
    // Check what happened
    console.log('\n📊 STATUS AFTER CLICK:');
    console.log(`   URL: ${page.url()}`);
    
    const token = await page.evaluate(() => localStorage.getItem('alimed_token'));
    console.log(`   Token: ${token ? token.substring(0, 50) + '...' : 'NO TOKEN'}`);
    
    const user = await page.evaluate(() => localStorage.getItem('alimed_user'));
    console.log(`   User: ${user ? 'YES' : 'NO'}`);
    
    // Check page content
    const pageContent = await page.content();
    if (pageContent.includes('dashboard') || pageContent.includes('Dashboard')) {
      console.log('   Page contains "dashboard" text');
    }
    if (pageContent.includes('login') || pageContent.includes('Login')) {
      console.log('   Page contains "login" text');
    }
    
    // Wait for any navigation that might still be pending
    console.log('\n⏳ Waiting 5 more seconds...');
    await page.waitForTimeout(5000);
    
    console.log(`\n📊 FINAL STATUS:`);
    console.log(`   URL: ${page.url()}`);
    
    if (page.url().includes('/dashboard')) {
      console.log('\n🎉 SUCCESS! Redirected to dashboard!');
    } else {
      console.log('\n❌ FAILED - Still not on dashboard');
      
      // Try manual navigation to dashboard
      console.log('\n🔧 Trying manual navigation to /dashboard...');
      await page.goto('https://alimed.com.pl/dashboard');
      await page.waitForLoadState('networkidle');
      console.log(`   After manual nav: ${page.url()}`);
      
      if (page.url().includes('/dashboard')) {
        console.log('✅ Manual navigation works - ProtectedRoute accepts the token');
      } else {
        console.log('❌ Manual navigation also redirected to login - ProtectedRoute issue');
      }
    }
    
    // Keep browser open
    console.log('\n⏳ Keeping browser open for 15 seconds...');
    await page.waitForTimeout(15000);
    
  } catch (error) {
    console.error('💥 Test error:', error);
  } finally {
    await browser.close();
    console.log('🔒 Browser closed');
  }
}

testLogin();
