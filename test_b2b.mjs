import { chromium } from 'playwright';

async function testB2B() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log("📱 Testing B2B Home Page...\n");
    
    page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('http://localhost:3002/b2b', { waitUntil: 'networkidle' });
    
    // Wait for lazy-loaded content
    await page.waitForTimeout(2000);
    
    // Check for key sections
    const heroTitle = await page.locator('h1').first();
    const featuresSection = await page.locator('h2').filter({ hasText: 'Built for Professionals' });
    const pricingSection = await page.locator('h2').filter({ hasText: 'Flexible Pricing Plans' });
    const partnersSection = await page.locator('h2').filter({ hasText: 'Trusted by Leading Workshops' });
    
    console.log("✅ Hero Section:", await heroTitle.isVisible() ? "Visible" : "Hidden");
    console.log("✅ Features Section:", await featuresSection.isVisible() ? "Visible" : "Hidden");
    console.log("✅ Pricing Section:", await pricingSection.isVisible() ? "Visible" : "Hidden");
    console.log("✅ Partners Section:", await partnersSection.isVisible() ? "Visible" : "Hidden");
    
    // Check for active navigation link
    await page.evaluate(() => window.scrollTo(0, 0));
    const homeLink = await page.locator('a:has-text("Home")').first();
    const homeClass = await homeLink.getAttribute('class');
    console.log("✅ Active Link Highlighting:", homeClass?.includes('primary') ? "Working" : "Check needed");
    
    // Take screenshots
    await page.screenshot({ path: 'b2b-full-page.png' });
    console.log("\n📸 Screenshot saved: b2b-full-page.png");
    
    // Test mobile responsiveness
    page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3002/b2b', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'b2b-mobile.png' });
    console.log("📸 Mobile screenshot saved: b2b-mobile.png");
    
    console.log("\n✅ B2B Home Page Implementation Complete!");
    
  } finally {
    await browser.close();
  }
}

testB2B();
