import * as url from 'url';
import path from 'path';
import fs from 'fs-extra';
import { glob } from 'glob';
import chalk from 'chalk';
import { replaceInFile } from 'replace-in-file';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const include3D = false;

const language = 'en';

const widgets = ['Popup', 'Slider'];

(async () => {
  /**
   * arcgis core
   */
  const arcgisSrc = path.resolve(__dirname, './../node_modules/@arcgis/core/assets');

  const arcgisDest = path.resolve(__dirname, './../src/public/arcgis');

  if (!arcgisSrc) {
    console.log(chalk.red.bold('@argis/core must be installed'));

    return;
  }

  if (arcgisDest) {
    await fs.remove(arcgisDest);
  }

  await fs.ensureDir(arcgisDest);

  await fs.copy(arcgisSrc, arcgisDest);

  await fs.remove(`${arcgisDest}/esri/css`);

  await fs.remove(`${arcgisDest}/esri/images`);

  await fs.remove(`${arcgisDest}/esri/symbols`);

  await fs.remove(`${arcgisDest}/esri/themes`);

  if (include3D === false) {
    await fs.remove(`${arcgisDest}/esri/views/3d`);

    await fs.remove(`${arcgisDest}/esri/webscene`);
  }

  (await glob(`${arcgisDest}/components/assets/**/*.json`)).forEach(async (file) => {
    if (!file.includes(`${language}.`)) await fs.remove(file);
  });

  const paths = [];

  (await glob(`${arcgisDest}/esri/widgets/**/`)).forEach((path) => {
    const parts = path.includes('\\') ? path.split('\\') : path.split('/');

    if (parts.length !== 6) return;

    if (widgets.indexOf(parts[5]) === -1) paths.push(path);
  });

  paths.forEach(async (path) => {
    await fs.remove(path);
  });

  (await glob(`${arcgisDest}/esri/**/t9n/**/*.json`)).forEach(async (file) => {
    if (!file.includes('_')) return;

    if (!file.includes(`_${language}`)) await fs.remove(file);
  });

  console.log(chalk.green('@argis/core assets copied'));

  /**
   * calcite
   */
  const calciteSrc = path.resolve(__dirname, './../node_modules/@esri/calcite-components/dist/calcite/assets');

  // cannot be flat directory must be `calcite/assets`
  const calciteDest = path.resolve(__dirname, './../src/public/calcite/assets');

  if (!calciteSrc) {
    console.log(chalk.red.bold('@esri/calcite-components must be installed'));

    return;
  }

  if (calciteDest) {
    await fs.remove(calciteDest);
  }

  await fs.ensureDir(calciteDest);

  await fs.copy(calciteSrc, calciteDest);

  (await glob(`${calciteDest}/**/*.json`)).forEach(async (file) => {
    if (!file.includes(`${language}.`)) await fs.remove(file);
  });

  console.log(chalk.green('@esri/calcite-components copied'));

  /**
   * map components
   */
  const mapComponentSrc = path.resolve(
    __dirname,
    './../node_modules/@arcgis/map-components/dist/arcgis-map-components/assets',
  );

  const mapComponentDest = path.resolve(__dirname, './../src/public/map-components');

  if (!mapComponentSrc) {
    console.log(chalk.red.bold('@argis/map-components must be installed'));
    return;
  }

  if (mapComponentDest) {
    await fs.remove(mapComponentDest);
  }

  await fs.ensureDir(mapComponentDest);

  await fs.copy(mapComponentSrc, mapComponentDest);

  (await glob(`${mapComponentDest}/**/*.json`)).forEach(async (file) => {
    if (!file.includes(`${language}.`)) await fs.remove(file);
  });

  console.log(chalk.green('@argis/map-components assets copied'));

  // remove bad typing (hopefully be fixed soon)
  const x = await replaceInFile({
    files: 'node_modules/@arcgis/map-components/dist/components/arcgis-basemap-gallery-item/customElement.d.ts',
    from: 'type BasemapGalleryMessages = ArcgisBasemapGallery["messages"];',
    to: '',
  });

  const y = await replaceInFile({
    files: 'node_modules/@arcgis/map-components/dist/components/arcgis-basemap-gallery-item/customElement.d.ts',
    from: 'messages: BasemapGalleryMessages;',
    to: '',
  });

  console.log(chalk.green(`Has changed: ${x[0].hasChanged}/${y[0].hasChanged}.`));
}).call();
