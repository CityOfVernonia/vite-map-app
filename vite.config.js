// https://vitejs.dev/config/

export default {
  // where's the source
  root: './src',

  // dev server options
  server: {
    https: true,
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
