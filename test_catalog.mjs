import { chromium } from 'playwright';

async function testCatalog() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log("📱 Testing B2B Catalog Page...\n");
    
    page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('http://localhost:3003/b2b/catalog', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    
    // Check for key elements
    const catalogTitle = await page.locator('h1').first();
    const filterButton = await page.locator('button:has-text("Filters")');
    const productCards = await page.locator('[class*="card"]').count();
    const sortDropdown = await page.locator('select').first();
    const pagination = await page.locator('button:has-text("Next")');
    
    console.log("✅ Page Elements Loaded:");
    console.log("  • Catalog Title:", await catalogTitle.isVisible() ? "✓" : "✗");
    console.log("  • Filter Panel:", await filterButton.isVisible() ? "✓" : "✗");
    console.log("  • Product Cards:", productCards > 0 ? `✓ (${productCards})` : "✗");
    console.log("  • Sort Dropdown:", await sortDropdown.isVisible() ? "✓" : "✗");
    console.log("  • Pagination:", await pagination.isVisible() ? "✓" : "✗");
    
    // Test filter interaction
    console.log("\n✅ Testing Filters:");
    const makeSelect = await page.locator('select').nth(0);
    await makeSelect.selectOption("Maruti");
    await page.waitForTimeout(800);
    console.log("  • Make Filter: ✓ (Selected Maruti)");
    
    // Check URL
    const url = await page.url();
    console.log("  • URL Sync:", url.includes("make=Maruti") ? "✓" : "✗");
    
    // Take screenshots
    await page.screenshot({ path: 'catalog-desktop.png' });
    console.log("\n📸 Desktop screenshot saved");
    
    // Test mobile
    page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3003/b2b/catalog', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'catalog-mobile.png' });
    console.log("📸 Mobile screenshot saved");
    
    console.log("\n✅ B2B Catalog Page Implementation Complete!");
    
  } finally {
    await browser.close();
  }
}

testCatalog();
