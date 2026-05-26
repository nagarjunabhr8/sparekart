import { chromium } from 'playwright';

async function verify() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log("📱 B2C Portal - Desktop View");
    page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('http://localhost:3000/b2c', { waitUntil: 'networkidle' });
    await page.evaluate(() => window.scrollBy(0, 2000));
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'b2c-products-section.png' });
    console.log("✅ B2C Featured Products captured");

    console.log("\n🏢 B2B Portal - Desktop View");
    await page.goto('http://localhost:3000/b2b', { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'b2b-hero.png' });
    await page.evaluate(() => window.scrollBy(0, 2000));
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'b2b-features.png' });
    console.log("✅ B2B Features captured");

    console.log("\n📱 Mobile View (375x667)");
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000/b2c', { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'mobile-b2c.png' });
    console.log("✅ Mobile view captured");

    console.log("\n✅ All screenshots captured successfully!");

  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

verify();
