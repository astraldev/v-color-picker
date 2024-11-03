import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
// import eslint from "vite-plugin-eslint2";
// import stylelint from "vite-plugin-stylelint";
import dts from 'vite-plugin-dts';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    AutoImport({
      vueTemplate: true,
      include: [
        /\.ts$/,
        /\.vue$/,
      ],
      imports: ["vue"],
      dirs: [
        './src/composables/*',
        "./src/utils/*"
      ],
      eslintrc: {
        enabled: true,
        filepath: "eslint-extends.json",
      },
    }),
    vue(),
    // eslint(),
    // stylelint(),
    dts({ tsconfigPath: './tsconfig.app.json' })
  ]
});
