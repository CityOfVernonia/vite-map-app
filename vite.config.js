// https://vitejs.dev/config/

import { ViteEjsPlugin } from 'vite-plugin-ejs';

import _package from './package.json';

export default {
  plugins: [
    ViteEjsPlugin({
      calcite: _package.dependencies['@esri/calcite-components'].replace('^', '').replace('~', ''),
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
  },

  esbuild: {
    // to build esri widgets properly
    jsxFactory: 'tsx',
  },
};
