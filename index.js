import express from 'express';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
  let browser;

  try {
    const url = req.query.url || 'https://fxlinks.fun/elinks/dex46910/';

    const executablePath = await chromium.executablePath(
      'https://github.com/Sparticuz/chromium/releases/download/v126.0.0/chromium-v126.0.0-pack.tar'
    );

    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
    );

    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const type = req.resourceType();
      if (['image', 'stylesheet', 'font'].includes(type)) req.abort();
      else req.continue();
    });

    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    await page.waitForSelector('h1', { timeout: 30000 });

    const data = await page.evaluate(() =>
      Array.from(document.querySelectorAll('h1')).map((el) => el.innerText.trim())
    );

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('❌ Error in scraping:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (browser) await browser.close();
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
