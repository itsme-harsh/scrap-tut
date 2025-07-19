// index.js
import express from 'express';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import chromium from '@sparticuz/chromium';

const app = express();
const PORT = process.env.PORT || 3000;

puppeteer.use(StealthPlugin());

app.get('/', async (req, res) => {
    try {
        const browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        });

        const page = await browser.newPage();
        const url = 'https://fxlinks.fun/elinks/dex46910/';
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
            '(KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
        );
        await page.setJavaScriptEnabled(true);
        await page.setDefaultNavigationTimeout(60000); // optional

        await page.goto(url, { waitUntil: 'load', timeout: 60000 });


        const data = await page.evaluate(() =>
            Array.from(document.querySelectorAll('h1')).map(el => el.innerText.trim())
        );

        await browser.close();

        console.log('✅ Scraped Data:', data);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('❌ Error in scraping:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
