// /api/scrape.js
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import chromium from '@sparticuz/chromium';

// Enable stealth plugin
puppeteer.use(StealthPlugin());

async function startScript() {
    try {
        const browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        });

        const page = await browser.newPage();
        const url = 'https://fxlinks.fun/elinks/dex46910/';

        await page.goto(url, { waitUntil: 'networkidle2' });

        // Example: Extract titles from all <h1> tags
        const data = await page.evaluate(() =>
            Array.from(document.querySelectorAll('h1')).map(el => el.innerText.trim())
        );
        console.log('Extracted Data:', data);
        await browser.close();
    } catch (error) {
        console.error('Error in scraping:', error);
    }
}

startScript();