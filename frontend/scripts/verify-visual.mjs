import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';

const targetUrl = process.argv[2] ?? 'http://127.0.0.1:5173';
const outputDir = path.resolve('artifacts');

const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
];

function analyzeCanvasImage(buffer) {
  const image = PNG.sync.read(buffer);
  let litPixels = 0;
  let brightPixels = 0;

  for (let index = 0; index < image.data.length; index += 4) {
    const alpha = image.data[index + 3];
    const luminance = image.data[index] * 0.2126 + image.data[index + 1] * 0.7152 + image.data[index + 2] * 0.0722;

    if (alpha > 20 && luminance > 30) {
      litPixels += 1;
    }

    if (alpha > 20 && luminance > 70) {
      brightPixels += 1;
    }
  }

  const totalPixels = image.width * image.height;

  return {
    brightPixels,
    litRatio: litPixels / totalPixels,
  };
}

function compareCanvasImages(firstBuffer, secondBuffer) {
  const first = PNG.sync.read(firstBuffer);
  const second = PNG.sync.read(secondBuffer);
  const length = Math.min(first.data.length, second.data.length);
  let changed = 0;

  for (let index = 0; index < length; index += 4) {
    const difference =
      Math.abs(first.data[index] - second.data[index]) +
      Math.abs(first.data[index + 1] - second.data[index + 1]) +
      Math.abs(first.data[index + 2] - second.data[index + 2]);

    if (difference > 18) {
      changed += 1;
    }
  }

  return changed / (length / 4);
}

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch();
const results = [];

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport });
  const consoleErrors = [];

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });

  await page.goto(targetUrl, { waitUntil: 'networkidle' });
  await page.waitForSelector('canvas', { state: 'visible', timeout: 15000 });
  await page.waitForTimeout(900);

  const canvas = page.locator('canvas');
  const firstFrame = await canvas.screenshot();

  await page.waitForTimeout(850);
  const secondFrame = await canvas.screenshot();
  const canvasStats = analyzeCanvasImage(secondFrame);
  const motionRatio = compareCanvasImages(firstFrame, secondFrame);

  const visualStats = await page.evaluate(() => {
    return {
      heroTitleVisible: Boolean(document.querySelector('#hero-title')?.getBoundingClientRect().width),
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
    };
  });

  const screenshotPath = path.join(outputDir, `nexum-${viewport.name}.png`);
  await page.screenshot({ fullPage: true, path: screenshotPath });

  results.push({
    ...viewport,
    ...visualStats,
    animated: motionRatio > 0.0004,
    brightPixels: canvasStats.brightPixels,
    canvasPresent: true,
    consoleErrors,
    motionRatio,
    nonBlankRatio: canvasStats.litRatio,
    screenshotPath,
  });

  await page.close();
}

await browser.close();

const failures = results.flatMap((result) => {
  const issues = [];

  if (!result.canvasPresent) issues.push(`${result.name}: canvas missing`);
  if (result.nonBlankRatio < 0.02 || result.brightPixels < 600) issues.push(`${result.name}: canvas appears blank`);
  if (!result.animated) issues.push(`${result.name}: canvas did not animate`);
  if (result.horizontalOverflow) issues.push(`${result.name}: horizontal overflow detected`);
  if (!result.heroTitleVisible) issues.push(`${result.name}: hero title is not visible`);
  if (result.consoleErrors.length > 0) issues.push(`${result.name}: console errors: ${result.consoleErrors.join(' | ')}`);

  return issues;
});

console.log(JSON.stringify({ results, failures }, null, 2));

if (failures.length > 0) {
  process.exitCode = 1;
}
