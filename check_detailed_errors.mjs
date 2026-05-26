import { chromium } from 'playwright';

async function checkErrors() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const failedRequests = [];
  
  page.on('response', response => {
    if (response.status() === 404) {
      failedRequests.push({
        url: response.url(),
        status: response.status(),
        method: response.request().method()
      });
    }
  });

  try {
    await page.goto('http://localhost:3001/b2c', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    
    if (failedRequests.length > 0) {
      console.log("📊 Failed Requests (404):\n");
      failedRequests.forEach(req => {
        console.log(`  ${req.method} ${req.url.replace(/.*localhost:\d+/, '')}`);
      });
    } else {
      console.log("✅ All requests successful!");
    }
    
  } finally {
    await browser.close();
  }
}

checkErrors();
