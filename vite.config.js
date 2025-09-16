import path from "path";
import * as pkg from "./package.json";
import dts from 'vite-plugin-dts';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

const NODE_ENV = process.argv.mode || "development";
const VERSION = pkg.version;

export default {
  build: {
    copyPublicDir: false,
    lib: {
      entry: path.resolve(__dirname, "src", "index.ts"),
      name: "ImageTool",
      fileName: "image",
    },
    minify: false,
  },
  server: {
    open: './dev/index.html',
  },
  define: {
    NODE_ENV: JSON.stringify(NODE_ENV),
    VERSION: JSON.stringify(VERSION),
  },

  plugins: [dts({
    tsconfigPath: './tsconfig.json'
  }),
  cssInjectedByJsPlugin({
    topExecutionPriority: false
  })
  ],
};
