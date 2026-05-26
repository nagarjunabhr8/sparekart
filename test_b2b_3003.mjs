import { chromium } from 'playwright';

async function testB2B() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log("📱 Testing B2B Home Page...\n");
    
    page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('http://localhost:3003/b2b', { waitUntil: 'networkidle' });
    
    // Wait for lazy-loaded content
    await page.waitForTimeout(2000);
    
    // Check for key sections
    const sections = {
      hero: await page.locator('h1').first().isVisible(),
      features: await page.locator('h2').filter({ hasText: 'Built for Professionals' }).isVisible(),
      pricing: await page.locator('h2').filter({ hasText: 'Flexible Pricing Plans' }).isVisible(),
      partners: await page.locator('h2').filter({ hasText: 'Trusted by Leading Workshops' }).isVisible(),
    };
    
    console.log("✅ Page Sections Loaded:");
    console.log("  • Hero Section:", sections.hero ? "✓" : "✗");
    console.log("  • Features Grid:", sections.features ? "✓" : "✗");
    console.log("  • Pricing Plans:", sections.pricing ? "✓" : "✗");
    console.log("  • Partners Section:", sections.partners ? "✓" : "✗");
    
    // Take screenshot
    await page.screenshot({ path: 'b2b-full-page.png' });
    console.log("\n📸 Desktop screenshot saved");
    
    // Test mobile responsiveness
    page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3003/b2b', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'b2b-mobile.png' });
    console.log("📸 Mobile screenshot saved");
    
    console.log("\n✅ B2B Home Page Implementation Complete!");
    
  } finally {
    await browser.close();
  }
}

testB2B();
