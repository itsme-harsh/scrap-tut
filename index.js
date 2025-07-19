import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min';

export const scrape = async () => {
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
    return title;
  } catch (error) {
    console.error("❌ Error in scraping:", error);
    throw error;
  }
};
