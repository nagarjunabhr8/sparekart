import { chromium } from 'playwright';

async function captureAll() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.setViewportSize({ width: 1280, height: 900 });
  
  await page.goto('http://localhost:3003/b2b', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  
  // Capture features section
  const featuresEl = await page.locator('h2').filter({ hasText: 'Built for Professionals' }).boundingBox();
  if (featuresEl) {
    await page.evaluate(() => window.scrollBy(0, 700));
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'b2b-features.png' });
  }
  
  // Capture pricing section
  await page.evaluate(() => window.scrollBy(0, 1200));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'b2b-pricing.png' });
  
  // Capture partners section
  await page.evaluate(() => window.scrollBy(0, 1200));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'b2b-partners.png' });
  
  await browser.close();
  console.log("✅ All sections captured");
}

captureAll();
