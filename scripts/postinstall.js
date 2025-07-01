import chalk from 'chalk';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import { glob } from 'glob';
import path from 'path';
const __dirname = fileURLToPath(new URL('.', import.meta.url));

const include3D = false;

const language = 'en';

// any @arcgis/core/widgets or associated view model that will be loaded
// Attribution and Zoom are required b/c the api loads them
const widgets = ['Attribution', 'Feature', 'Features', 'LayerList', 'Legend', 'Locate', 'Popup', 'Search', 'Zoom'];

// any @arcgis/core/widgets files which are required
const files = ['esri/widgets/support/t9n/uriUtils.json', `esri/widgets/support/t9n/uriUtils_${language}.json`];

(async () => {
  try {
    /**
     * arcgis core
     */
    console.log(chalk.green('Copying @argis/core...'));

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

    const arcGisComponentJson = await glob(`${arcgisDest}/components/assets/**/*.json`);

    for (const file of arcGisComponentJson) {
      if (!file.includes(`${language}.`) && !file.includes('icon')) await fs.remove(file);
    }

    await fs.remove(`${arcgisDest}/esri/widgets`);

    await fs.ensureDir(`${arcgisDest}/esri/widgets`);

    for (const widget of widgets) {
      await fs.copy(`${arcgisSrc}/esri/widgets/${widget}`, `${arcgisDest}/esri/widgets/${widget}`);
    }

    const t9nJson = await glob(`${arcgisDest}/esri/**/t9n/**/*.json`);

    for (const file of t9nJson) {
      if (file.split('_').length > 1 && !file.includes(`_${language}`)) await fs.remove(file);
    }

    for (const file of files) {
      const parts = file.split('/');

      parts.splice(parts.length - 1, 1);

      await fs.ensureDir(`${arcgisDest}/${parts.join('/')}`);

      await fs.copy(`${arcgisSrc}/${file}`, `${arcgisDest}/${file}`);
    }

    console.log(chalk.green('@argis/core assets copied'));

    /**
     * calcite
     */
    console.log(chalk.green('Copying @esri/calcite-components...'));

    const calciteSrc = path.resolve(__dirname, './../node_modules/@esri/calcite-components/dist/calcite/assets');

    const calciteDest = path.resolve(__dirname, './../src/public/calcite');

    if (!calciteSrc) {
      console.log(chalk.red.bold('@esri/calcite-components must be installed'));

      return;
    }

    if (calciteDest) {
      await fs.remove(calciteDest);
    }

    await fs.ensureDir(calciteDest);

    await fs.copy(calciteSrc, calciteDest);

    const calciteComponentJson = await glob(`${calciteDest}/**/*.json`);

    for (const file of calciteComponentJson) {
      if (!file.includes(`${language}.`) && !file.includes('icon')) await fs.remove(file);
    }

    // copy calcite icons for arcgis
    const arcgisIcons = `${arcgisDest}/components/assets/icon`;

    await fs.remove(arcgisIcons);

    await fs.ensureDir(arcgisIcons);

    await fs.copy(`${calciteDest}/icon`, arcgisIcons);

    console.log(chalk.green('@esri/calcite-components copied'));

    /**
     * map components
     */
    console.log(chalk.green('Copying @argis/map-components...'));

    const mapComponentSrc = path.resolve(
      __dirname,
      './../node_modules/@arcgis/map-components/dist/cdn/assets',
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

    const mapComponentsJson = await glob(`${mapComponentDest}/**/*.json`);

    for (const file of mapComponentsJson) {
      if (!file.includes(`${language}.`)) await fs.remove(file);
    }

    console.log(chalk.green('@argis/map-components assets copied'));
  } catch (error) {
    console.log(error);
  }
}).call();
