import * as url from 'url';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { replaceInFile } from 'replace-in-file';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

(async () => {
  // copy arcgis core assets
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
  // delete unnecessary arcgis assets
  await fs.remove(path.resolve(__dirname, './../src/public/arcgis/esri/css'));
  await fs.remove(path.resolve(__dirname, './../src/public/arcgis/esri/themes'));
  console.log(chalk.green('@argis/core assets copied'));

  // copy map components
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
  console.log(chalk.green('@argis/map-components assets copied'));

  // copy calcite components
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
  console.log(chalk.green('@esri/calcite-components copied'));

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
