const { chromium } = require('playwright');
const { mkdir, readFile } = require('node:fs/promises');
const { join } = require('node:path');
const { pathToFileURL } = require('node:url');

const layouts = [
  ['line_rich_1040', 1040, 1040],
  ['insta_01_cover', 1080, 1350],
  ['insta_02_plan', 1080, 1350],
  ['insta_03_point', 1080, 1350],
];

async function build() {
  const output = join(__dirname, 'out');
  await mkdir(output, { recursive: true });
  const browser = await chromium.launch();
  try {
    for (const [name, width, height] of layouts) {
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
      await page.goto(pathToFileURL(join(__dirname, 'src', name + '.html')).href);
      await page.evaluate(() => document.fonts.ready);
      const fonts = await page.evaluate(() =>
        ['Mochiy Pop One', 'Zen Maru Gothic'].every(family =>
          [...document.fonts].some(face => face.family === family && face.status === 'loaded')
        )
      );
      if (!fonts) throw new Error('Japanese fonts failed to load for ' + name);
      const path = join(output, name + '.png');
      await page.screenshot({ path, clip: { x: 0, y: 0, width, height } });
      const png = await readFile(path);
      if (png.readUInt32BE(16) !== width || png.readUInt32BE(20) !== height) {
        throw new Error('Unexpected PNG dimensions for ' + name);
      }
      console.log(name + '.png', width + ' × ' + height);
      await page.close();
    }
  } finally {
    await browser.close();
  }
}

build().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
