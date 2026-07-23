import { chromium } from 'playwright';
import fs from 'fs';

const urls = [
  "https://www.indeed.com/jobs?q=Systems+Administrator+I+Papa+Murphy%27s&l=Vancouver%2C+WA",
  "https://www.indeed.com/jobs?q=System+Administrator+AZAD+Technology+Partners&l=Vancouver%2C+WA",
  "https://www.indeed.com/jobs?q=Senior+MSP+Systems+Engineer+edgefi&l=Vancouver%2C+WA",
  "https://www.indeed.com/jobs?q=Sr.+IT+Support+Specialist+Pacific+Energy+Concepts&l=Vancouver%2C+WA",
  "https://www.indeed.com/jobs?q=Senior+Operations+Technology+System+Administrator+Avangrid&l=Vancouver%2C+WA"
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  for (let i = 0; i < urls.length; i++) {
    console.log(`Navigating to ${urls[i]}...`);
    try {
      await page.goto(urls[i], { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(3000); // Wait a bit for JS to render the job desc
      const text = await page.evaluate(() => document.body.innerText);
      fs.writeFileSync(`url_${i + 1}.txt`, text);
      console.log(`Saved url_${i + 1}.txt`);
    } catch (e) {
      console.error(`Error on URL ${i + 1}: ${e.message}`);
    }
  }

  await browser.close();
})();
