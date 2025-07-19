// index.js
import express from 'express';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import chromium from '@sparticuz/chromium';

const app = express();
const PORT = process.env.PORT || 3000;

puppeteer.use(StealthPlugin());

app.get('/', async (req, res) => {
  const url = 'https://fxlinks.fun/elinks/dex46910/';
  let browser;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
    const page = await browser.newPage();

    // 1. Fake a real UA
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
      'AppleWebKit/537.36 (KHTML, like Gecko) ' +
      'Chrome/114.0.0.0 Safari/537.36'
    );

    // 2. Block images/styles/fonts
    await page.setRequestInterception(true);
    page.on('request', req => {
      const t = req.resourceType();
      if (['image','stylesheet','font'].includes(t)) req.abort();
      else req.continue();
    });

    // 3. Shorter navigation wait: DOMContentLoaded only
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,           // 30s
    });

    // 4. Now explicitly wait for the selector you want
    await page.waitForSelector('h1', { timeout: 30000 });

    // 5. Extract data
    const data = await page.evaluate(() =>
      Array.from(document.querySelectorAll('h1')).map(el => el.innerText.trim())
    );

    console.log('✅ Scraped Data:', data);
    res.json({ success: true, data });

  } catch (err) {
    console.error('❌ Error in scraping:', err);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    if (browser) await browser.close();
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Listening on http://localhost:${PORT}`);
});
