import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import eslintAutoImport from "./eslint-extends.json"  with { type: "json" };

/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts,vue}"]},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/strongly-recommended"],
  {files: ["**/*.vue"], languageOptions: {parserOptions: {parser: tseslint.parser}}},
  {
    languageOptions: eslintAutoImport,
    rules: {
      "indent": ["error", 2],
      "semi": 1,
      "vue/multi-word-component-names": "off",
    },
  }
];