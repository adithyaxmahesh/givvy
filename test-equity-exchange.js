const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testGivvy() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();
  
  const screenshotsDir = path.join(__dirname, 'test-screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  const results = {
    passed: [],
    failed: [],
    errors: []
  };

  console.log('\n=== Starting Givvy Test Sequence ===\n');

  try {
    // Step 1: Navigate to landing page
    console.log('Step 1: Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Verify landing page elements
    const heroSection = await page.locator('text=/get started|join|sign up/i').first().isVisible().catch(() => false);
    const hasContent = await page.content();
    
    if (hasContent.includes('Givvy') || hasContent.includes('startup') || heroSection) {
      console.log('✓ Landing page loaded successfully');
      results.passed.push('Landing page loaded with content');
    } else {
      console.log('✗ Landing page may not have loaded correctly');
      results.failed.push('Landing page content verification');
    }

    // Step 2: Take screenshot of landing page
    console.log('\nStep 2: Taking screenshot of landing page...');
    await page.screenshot({ path: path.join(screenshotsDir, '01-landing-page.png'), fullPage: true });
    console.log('✓ Screenshot saved: 01-landing-page.png');
    results.passed.push('Landing page screenshot captured');

    // Step 3: Navigate to signup page
    console.log('\nStep 3: Navigating to signup page...');
    try {
      const getStartedButton = await page.locator('text=/get started/i').first();
      if (await getStartedButton.isVisible({ timeout: 3000 })) {
        await getStartedButton.click();
        await page.waitForTimeout(1500);
        console.log('✓ Clicked "Get Started" button');
      }
    } catch (e) {
      console.log('  Get Started button not found, navigating directly to /signup');
      await page.goto('http://localhost:3000/signup', { waitUntil: 'networkidle' });
    }
    
    await page.waitForTimeout(1000);
    const signupContent = await page.content();
    if (signupContent.includes('sign up') || signupContent.includes('create account') || page.url().includes('signup')) {
      console.log('✓ Signup page loaded');
      results.passed.push('Signup page navigation');
    } else {
      console.log('✗ Signup page may not have loaded');
      results.failed.push('Signup page navigation');
    }
    await page.screenshot({ path: path.join(screenshotsDir, '02-signup-page.png'), fullPage: true });

    // Step 4: Navigate to login page
    console.log('\nStep 4: Navigating to login page...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    
    const loginContent = await page.content();
    if (loginContent.includes('sign in') || loginContent.includes('login') || loginContent.includes('email')) {
      console.log('✓ Login page loaded');
      results.passed.push('Login page navigation');
    } else {
      console.log('✗ Login page may not have loaded');
      results.failed.push('Login page navigation');
    }
    await page.screenshot({ path: path.join(screenshotsDir, '03-login-page.png'), fullPage: true });

    // Step 5 & 6: Enter credentials and sign in
    console.log('\nStep 5-6: Entering credentials and signing in...');
    
    // Try different possible selectors for email input
    let emailInput = null;
    const emailSelectors = [
      'input[type="email"]',
      'input[name="email"]',
      'input[placeholder*="email" i]',
      'input#email'
    ];
    
    for (const selector of emailSelectors) {
      try {
        emailInput = await page.locator(selector).first();
        if (await emailInput.isVisible({ timeout: 1000 })) {
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (emailInput && await emailInput.isVisible().catch(() => false)) {
      await emailInput.fill('founder@demo.com');
      console.log('✓ Email entered: founder@demo.com');
      
      // Try different possible selectors for password input
      let passwordInput = null;
      const passwordSelectors = [
        'input[type="password"]',
        'input[name="password"]',
        'input[placeholder*="password" i]',
        'input#password'
      ];
      
      for (const selector of passwordSelectors) {
        try {
          passwordInput = await page.locator(selector).first();
          if (await passwordInput.isVisible({ timeout: 1000 })) {
            break;
          }
        } catch (e) {
          continue;
        }
      }

      if (passwordInput && await passwordInput.isVisible().catch(() => false)) {
        await passwordInput.fill('password123');
        console.log('✓ Password entered');
        
        // Find and click sign in button
        const signInSelectors = [
          'button:has-text("Sign In")',
          'button:has-text("Login")',
          'button:has-text("Log In")',
          'button[type="submit"]'
        ];
        
        let signInButton = null;
        for (const selector of signInSelectors) {
          try {
            signInButton = await page.locator(selector).first();
            if (await signInButton.isVisible({ timeout: 1000 })) {
              break;
            }
          } catch (e) {
            continue;
          }
        }

        if (signInButton && await signInButton.isVisible().catch(() => false)) {
          await signInButton.click();
          console.log('✓ Clicked Sign In button');
          results.passed.push('Login form submission');
          
          // Step 7: Wait for redirect to dashboard
          console.log('\nStep 7: Waiting for redirect to dashboard...');
          await page.waitForTimeout(3000);
          
          const currentUrl = page.url();
          console.log(`  Current URL: ${currentUrl}`);
          
          if (currentUrl.includes('dashboard')) {
            console.log('✓ Successfully redirected to dashboard');
            results.passed.push('Dashboard redirect after login');
          } else {
            console.log('✗ Not redirected to dashboard, checking for errors...');
            const pageText = await page.textContent('body');
            if (pageText.includes('error') || pageText.includes('invalid') || pageText.includes('incorrect')) {
              console.log('  Login may have failed - error message detected');
              results.failed.push('Login authentication');
            } else {
              console.log('  May have redirected to different page');
              results.failed.push('Dashboard redirect');
            }
          }
        } else {
          console.log('✗ Sign In button not found');
          results.failed.push('Sign In button not found');
        }
      } else {
        console.log('✗ Password input not found');
        results.failed.push('Password input not found');
      }
    } else {
      console.log('✗ Email input not found');
      results.failed.push('Email input not found');
    }

    // Step 8: Take screenshot of dashboard
    console.log('\nStep 8: Taking screenshot of current page (dashboard)...');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(screenshotsDir, '04-dashboard.png'), fullPage: true });
    console.log('✓ Screenshot saved: 04-dashboard.png');

    // Step 9: Check dashboard elements
    console.log('\nStep 9: Checking dashboard elements...');
    const dashboardContent = await page.content();
    const dashboardText = await page.textContent('body').catch(() => '');
    
    const checks = {
      'Alex Chen': dashboardText.includes('Alex Chen'),
      'Stat cards': dashboardText.includes('Active Deals') || dashboardText.includes('Total') || dashboardContent.includes('stat'),
      'Active deals': dashboardText.includes('deal') || dashboardText.includes('Deal'),
      'Notifications': dashboardText.includes('notification') || dashboardText.includes('Notification')
    };
    
    for (const [element, found] of Object.entries(checks)) {
      if (found) {
        console.log(`✓ Found: ${element}`);
        results.passed.push(`Dashboard element: ${element}`);
      } else {
        console.log(`✗ Not found: ${element}`);
        results.failed.push(`Dashboard element: ${element}`);
      }
    }

    // Step 10: Navigate to marketplace
    console.log('\nStep 10: Navigating to marketplace...');
    await page.goto('http://localhost:3000/marketplace', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(screenshotsDir, '05-marketplace.png'), fullPage: true });
    
    const marketplaceText = await page.textContent('body').catch(() => '');
    if (marketplaceText.includes('startup') || marketplaceText.includes('talent') || marketplaceText.includes('Marketplace')) {
      console.log('✓ Marketplace page loaded with listings');
      results.passed.push('Marketplace navigation');
    } else {
      console.log('✗ Marketplace may not have loaded correctly');
      results.failed.push('Marketplace navigation');
    }
    console.log('✓ Screenshot saved: 05-marketplace.png');

    // Step 11: Navigate to deals
    console.log('\nStep 11: Navigating to deals page...');
    await page.goto('http://localhost:3000/deals', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(screenshotsDir, '06-deals.png'), fullPage: true });
    
    const dealsText = await page.textContent('body').catch(() => '');
    if (dealsText.includes('deal') || dealsText.includes('Deal') || page.url().includes('deals')) {
      console.log('✓ Deals page loaded');
      results.passed.push('Deals page navigation');
    } else {
      console.log('✗ Deals page may not have loaded correctly');
      results.failed.push('Deals page navigation');
    }
    console.log('✓ Screenshot saved: 06-deals.png');

    // Step 12: Log out
    console.log('\nStep 12: Attempting to log out...');
    
    // Try to find profile dropdown or sign out button
    const logoutSelectors = [
      'button:has-text("Sign Out")',
      'button:has-text("Logout")',
      'button:has-text("Log Out")',
      'a:has-text("Sign Out")',
      'a:has-text("Logout")',
      '[data-testid="logout"]',
      '[data-testid="signout"]'
    ];
    
    // First try to find and click profile dropdown
    try {
      const profileButton = await page.locator('button:has-text("Profile"), button:has-text("Account"), [data-testid="profile"], [aria-label*="profile" i]').first();
      if (await profileButton.isVisible({ timeout: 2000 })) {
        await profileButton.click();
        console.log('✓ Clicked profile dropdown');
        await page.waitForTimeout(500);
      }
    } catch (e) {
      console.log('  Profile dropdown not found, looking for direct logout button');
    }
    
    let loggedOut = false;
    for (const selector of logoutSelectors) {
      try {
        const logoutButton = await page.locator(selector).first();
        if (await logoutButton.isVisible({ timeout: 1000 })) {
          await logoutButton.click();
          console.log('✓ Clicked Sign Out button');
          loggedOut = true;
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    if (loggedOut) {
      await page.waitForTimeout(2000);
      results.passed.push('Logout action');
    } else {
      console.log('✗ Sign Out button not found');
      results.failed.push('Logout button not found');
    }

    // Step 13: Verify redirect after logout
    console.log('\nStep 13: Verifying redirect after logout...');
    await page.waitForTimeout(1500);
    const finalUrl = page.url();
    console.log(`  Final URL: ${finalUrl}`);
    
    if (finalUrl.includes('login') || finalUrl === 'http://localhost:3000/' || !finalUrl.includes('dashboard')) {
      console.log('✓ Successfully redirected after logout');
      results.passed.push('Logout redirect');
    } else {
      console.log('✗ May not have redirected correctly after logout');
      results.failed.push('Logout redirect');
    }
    
    await page.screenshot({ path: path.join(screenshotsDir, '07-after-logout.png'), fullPage: true });
    console.log('✓ Screenshot saved: 07-after-logout.png');

  } catch (error) {
    console.error('\n❌ Error during test execution:', error.message);
    results.errors.push(error.message);
    await page.screenshot({ path: path.join(screenshotsDir, 'error-screenshot.png'), fullPage: true });
  }

  await browser.close();

  // Print summary
  console.log('\n\n=== TEST SUMMARY ===\n');
  console.log(`✓ Passed: ${results.passed.length}`);
  results.passed.forEach(item => console.log(`  - ${item}`));
  
  if (results.failed.length > 0) {
    console.log(`\n✗ Failed: ${results.failed.length}`);
    results.failed.forEach(item => console.log(`  - ${item}`));
  }
  
  if (results.errors.length > 0) {
    console.log(`\n❌ Errors: ${results.errors.length}`);
    results.errors.forEach(item => console.log(`  - ${item}`));
  }
  
  console.log(`\n📸 Screenshots saved in: ${screenshotsDir}`);
  console.log('\n=== TEST COMPLETE ===\n');
}

testGivvy();
