import * as url from 'url';
import path from 'path';
import fs from 'fs-extra';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

async function copyArcgisCoreAssets() {
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

copyArcgisCoreAssets();

async function copyCalciteComponents() {
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
  await fs.copy(src, dest);

  copyCalciteIcons()
}

copyCalciteComponents();

async function copyCalciteIcons() {
  const src = path.resolve(__dirname, './../node_modules/@esri/calcite-ui-icons/js');
  const dest = path.resolve(__dirname, './../src/public/calcite/assets/icon');
  if (!src) {
    console.log('@esri/calcite-ui-icons must be installed');
    return;
  }
  const files = await fs.readdir(src);
  files.forEach(async (file) => {
    if (file.includes('.json')) {
      const destFile = `${dest}/${file}`;
      const exists = await fs.exists(destFile);
      if (!exists) {
        await fs.copyFile(`${src}/${file}`, destFile);
      }
    }
  });
}
