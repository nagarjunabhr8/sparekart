import { chromium } from 'playwright';

async function checkErrors() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const errors = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`[ERROR] ${msg.text()}`);
    }
  });
  
  page.on('pageerror', err => {
    errors.push(`[PAGE ERROR] ${err.message}`);
  });

  try {
    await page.goto('http://localhost:3001/b2c', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    
    if (errors.length > 0) {
      console.log("❌ ERRORS FOUND:\n");
      errors.forEach(e => console.log(e));
      process.exit(1);
    } else {
      console.log("✅ No console errors found!");
      console.log("✅ Hydration errors fixed!");
      console.log("✅ 404 favicon error fixed!");
    }
    
  } finally {
    await browser.close();
  }
}

checkErrors();
