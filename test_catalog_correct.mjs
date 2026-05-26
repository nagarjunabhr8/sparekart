import { chromium } from 'playwright';

async function testCatalog() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log("📱 Testing B2B Catalog on port 3004...\n");
    
    page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('http://localhost:3004/b2b/catalog', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    
    const catalogTitle = await page.locator('h1').first();
    const productCards = await page.locator('[class*="card"]').count();
    
    console.log("✅ Catalog Page Status:");
    console.log("  • Title Visible:", await catalogTitle.isVisible() ? "✓" : "✗");
    console.log("  • Product Cards Loaded:", productCards > 0 ? `✓ (${productCards})` : "✗");
    
    // Take screenshots
    await page.screenshot({ path: 'catalog-desktop.png' });
    console.log("\n📸 Desktop screenshot saved");
    
    // Mobile view
    page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3004/b2b/catalog', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'catalog-mobile.png' });
    console.log("📸 Mobile screenshot saved");
    
    console.log("\n✅ Catalog testing complete!");
    
  } finally {
    await browser.close();
  }
}

testCatalog();
