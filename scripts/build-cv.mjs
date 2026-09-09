/**
 * Regenerates public/AdiPrabs_SWE.pdf from the /cv-print route, so the PDF can
 * never drift from src/data/profile.ts and src/data/cv.ts.
 *
 *   npm run dev                 # in one terminal
 *   node scripts/build-cv.mjs   # needs puppeteer available
 *
 * No puppeteer? Open http://localhost:3000/cv-print and print to PDF from the
 * browser. The @page rule in cv-print/cv.css owns the margins, so the output
 * matches.
 */
import puppeteer from 'puppeteer';

const URL = process.env.CV_URL ?? 'http://localhost:3000/cv-print';
const OUT = process.env.CV_OUT ?? 'public/AdiPrabs_SWE.pdf';

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));

await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60_000 });
await page.emulateMediaType('print');
await page.pdf({ path: OUT, printBackground: true, preferCSSPageSize: true });

await browser.close();
if (errors.length) {
  console.error('page errors:', errors);
  process.exit(1);
}
console.log(`wrote ${OUT}`);
