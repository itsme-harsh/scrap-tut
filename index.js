import express from 'express';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
  try {
    const executablePath = await chromium.executablePath(
      "https://github.com/Sparticuz/chromium/releases/download/v126.0.0/chromium-v126.0.0-pack.tar"
    );

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto('https://example.com');
    const title = await page.title();

    await browser.close();
    res.send(`Title: ${title}`);
  } catch (err) {
    console.error('❌ Error in scraping:', err);
    res.status(500).send('Scraping failed');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
