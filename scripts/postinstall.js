const path = require('path');
const fs = require('fs-extra');
const replace = require('replace-in-file');

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

try {
  const results = replace.sync({
    files: 'node_modules/@arcgis/core/assets/esri/themes/base/_core.scss',
    from: '@import "@esri/calcite-components/dist/calcite/calcite";',
    to: '// @import "@esri/calcite-components/dist/calcite/calcite";',
  });
  console.log(results);
} catch (error) {
  console.error(error);
}

try {
  const results = replace.sync({
    files: 'node_modules/@arcgis/core/assets/esri/themes/base/widgets/_Spinner.scss',
    from: '../base/images/Loading_Indicator_double_32.svg',
    to: './../node_modules/@arcgis/core/assets/esri/themes/base/images/Loading_Indicator_double_32.svg',
  });
  console.log(results);
} catch (error) {
  console.error(error);
}

try {
  const results = replace.sync({
    files: 'node_modules/@arcgis/core/assets/esri/themes/base/widgets/_BasemapToggle.scss',
    from: '../base/images/basemap-toggle-64.svg',
    to: './../node_modules/@arcgis/core/assets/esri/themes/base/images/basemap-toggle-64.svg',
  });
  console.log(results);
} catch (error) {
  console.error(error);
}

// TODO: Legend widget

// TODO: Bookmark widget
