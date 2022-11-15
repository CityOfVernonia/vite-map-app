// https://vitejs.dev/config/
// import { resolve } from 'path';
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import _package from './package.json';

const calciteVersion = _package.dependencies['@esri/calcite-components'].replace('^', '').replace('~', '');
const calciteUrl = `https://js.arcgis.com/calcite-components/${calciteVersion}/calcite.esm.js`;

export default {
  plugins: [
    ViteEjsPlugin({
      calciteUrl,
    }),
  ],

  // where's the source
  root: './src',

  // dev server options
  server: {
    // https: true,
    port: 8080,
    open: true,
  },

  build: {
    // where to build relative to source
    outDir: './../dist',
    // multi-page app config
    // rollupOptions: {
    //   input: {
    //     main: resolve(__dirname, 'src/index.html'),
    //     something: resolve(__dirname, 'src/something/index.html'),
    //   },
    // },
  },

  esbuild: {
    // to build esri widgets properly
    jsxFactory: 'tsx',
  },
};
