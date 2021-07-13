const replace = require('replace-in-file');

// try {
//   const results = replace.sync({
//     files: 'node_modules/@arcgis/core/assets/esri/themes/base/_core.scss',
//     from: '$icomoon-font-path: "../base/icons/fonts";',
//     to: '$icomoon-font-path: "../base/icons/fonts" !default;',
//   });
//   console.log(results);
// } catch (error) {
//   console.error(error);
// }

// try {
//   const results = replace.sync({
//     files: 'node_modules/@arcgis/core/assets/esri/themes/base/_core.scss',
//     from: '$calcite-fonts-path: "../base/fonts/fonts/";',
//     to: '$calcite-fonts-path: "../base/fonts/fonts/" !default;',
//   });
//   console.log(results);
// } catch (error) {
//   console.error(error);
// }

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
