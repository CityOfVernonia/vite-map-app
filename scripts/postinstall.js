import * as url from 'url';
import path from 'path';
import fs from 'fs-extra';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

async function copyAssets() {
  const src = path.resolve(__dirname, './../node_modules/@arcgis/core/assets');
  const dest = path.resolve(__dirname, './../src/public/arcgis');
  if (!src) {
    console.log('@argis/core must be installed');
    return;
  }
  if (dest) {
    await fs.remove(dest);
  }
  await fs.ensureDir(dest);
  fs.copy(src, dest);
}

copyAssets();

async function copyCalcite() {
  const src = path.resolve(__dirname, './../node_modules/@esri/calcite-components/dist/calcite');
  const dest = path.resolve(__dirname, './../src/public/calcite');
  if (!src) {
    console.log('@esri/calcite-components must be installed');
    return;
  }
  if (dest) {
    await fs.remove(dest);
  }
  await fs.ensureDir(dest);
  fs.copy(src, dest);
}

copyCalcite();
