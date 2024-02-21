import * as url from 'url';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

async function assets() {
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
  console.log(chalk.green('@argis/core assets copied'));

  // copy calcite components
  const calciteSrc = path.resolve(__dirname, './../node_modules/@esri/calcite-components/dist/calcite');
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
  console.log(chalk.green('@esri/calcite-components copied'));

  // most up-to-date calcite icons
  const iconSrc = path.resolve(__dirname, './../node_modules/@esri/calcite-ui-icons/js');
  const iconDest = path.resolve(__dirname, './../src/public/calcite/assets/icon');
  if (!iconSrc) {
    console.log(chalk.red.bold('@esri/calcite-ui-icons must be installed'));
    return;
  }
  let icons = 0;
  const files = await fs.readdir(iconSrc);
  files.forEach(async (file) => {
    if (file.includes('.json')) {
      const destFile = `${iconDest}/${file}`;
      const exists = await fs.exists(destFile);
      if (!exists) {
        icons++;
        await fs.copyFile(`${iconSrc}/${file}`, destFile);
      }
    }
  });
  console.log(chalk.green(`@esri/calcite-ui-icons very up-to-date with ${icons} added`));
}

assets();
