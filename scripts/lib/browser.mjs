// Společné spuštění headless Chrome pro testy, snímky a PDF.
// Cestu k Chrome jde přepsat proměnnou CHROME_PATH (výchozí je macOS).
import puppeteer from 'puppeteer-core';

export const CHROME_PATH = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
export const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:8737/';
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function launch() {
  return puppeteer.launch({ executablePath: CHROME_PATH, headless: 'new' });
}

// Mobil na šířku 375 px (iPhone SE / 8), dotykové ovládání.
export async function mobilePage(browser) {
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 667, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  return page;
}
