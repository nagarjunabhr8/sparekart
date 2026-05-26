import { chromium } from 'playwright';

async function checkErrors() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const errors = [];
  const warnings = [];
  
  // Capture console messages
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`[ERROR] ${msg.text()}`);
    } else if (msg.type() === 'warning') {
      warnings.push(`[WARNING] ${msg.text()}`);
    }
  });
  
  // Capture page errors
  page.on('pageerror', err => {
    errors.push(`[PAGE ERROR] ${err.message}`);
  });

  try {
    await page.goto('http://localhost:3000/b2c', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    
    if (errors.length > 0) {
      console.log("❌ ERRORS FOUND:\n");
      errors.forEach(e => console.log(e));
    } else {
      console.log("✅ No errors found on B2C portal");
    }
    
    if (warnings.length > 0) {
      console.log("\n⚠️ WARNINGS:\n");
      warnings.forEach(w => console.log(w));
    }
    
  } finally {
    await browser.close();
  }
}

checkErrors();
