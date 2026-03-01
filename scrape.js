const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const base = 'https://sanand0.github.io/tdsdata/js_table/';
  const seeds = [88,89,90,91,92,93,94,95,96,97];
  let grandTotal = 0;

  for (const seed of seeds) {
    const url = `${base}?seed=${seed}`;
    console.log(`Scraping seed ${seed}...`);
    
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForSelector('table');
    
    const numbers = await page.evaluate(() => {
      const cells = document.querySelectorAll('table td, table th');
      return Array.from(cells)
        .map(cell => {
          const text = cell.textContent.trim().replace(/[,$]/g, '');
          const num = parseFloat(text);
          return !isNaN(num) ? num : 0;
        })
        .filter(num => num > 0);
    });

    const pageSum = numbers.reduce((sum, n) => sum + n, 0);
    grandTotal += pageSum;
    console.log(`Seed ${seed} sum: ${pageSum.toFixed(2)}`);
  }

  console.log(`\n🎯 GRAND TOTAL SUM OF ALL TABLES: ${grandTotal.toFixed(2)}`);
  await browser.close();
})();
