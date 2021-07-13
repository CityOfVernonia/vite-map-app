const path = require('path');
const fs = require('fs-extra');

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
