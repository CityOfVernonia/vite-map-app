const replace = require('replace-in-file');

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
