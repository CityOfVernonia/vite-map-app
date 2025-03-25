// https://vitejs.dev/config/

export default {
  root: './src',
  server: {
    port: 8080,
    open: true,
  },
  build: {
    outDir: './../dist',
  },
  esbuild: {
    jsxFactory: 'tsx',
  },
};
