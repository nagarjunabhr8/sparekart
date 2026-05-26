import { chromium } from 'playwright';

async function verify() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.setViewportSize({ width: 1280, height: 720 });

  try {
    console.log("📱 Testing B2C Portal...");
    await page.goto('http://localhost:3000/b2c', { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'b2c-home.png' });
    console.log("✅ B2C Homepage loaded and screenshot saved");

    // Test parts finder form
    console.log("\n🔍 Testing Smart Parts Finder...");
    await page.click('select[value=""]'); // Click brand dropdown
    await page.waitForTimeout(500);
    const hasBrands = await page.locator('select').count();
    console.log(`✅ Parts finder form has ${hasBrands} select elements`);

    // Scroll down to see featured products
    console.log("\n📦 Checking Featured Products...");
    await page.evaluate(() => window.scrollBy(0, 1200));
    await page.waitForTimeout(300);
    const products = await page.locator('[href*="/b2c/products/"]').count();
    console.log(`✅ Found ${products} product links on page`);
    await page.screenshot({ path: 'b2c-products.png' });

    // Test B2B Portal
    console.log("\n🏢 Testing B2B Portal...");
    await page.goto('http://localhost:3000/b2b', { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'b2b-home.png' });
    console.log("✅ B2B Homepage loaded");

    // Check B2B features
    const b2bFeatures = await page.locator('.card').count();
    console.log(`✅ B2B page has ${b2bFeatures} feature cards`);

    // Test mobile responsiveness
    console.log("\n📱 Testing Mobile Responsiveness...");
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000/b2c', { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'mobile-view.png' });
    console.log("✅ Mobile view rendered (375x667)");

    // Test navigation menu
    console.log("\n☰ Testing Navigation...");
    await page.click('button:has-text("Menu")');
    await page.waitForTimeout(300);
    const menuItems = await page.locator('a[href*="/b2c"]').count();
    console.log(`✅ Mobile menu has ${menuItems} navigation items`);

    console.log("\n✅ All verification steps passed!");

  } catch (error) {
    console.error("❌ Verification failed:", error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

verify();
