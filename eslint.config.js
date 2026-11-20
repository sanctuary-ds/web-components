import tsParser from "@typescript-eslint/parser";
import lit from "eslint-plugin-lit";
import wc from "eslint-plugin-wc";

export default [
  {
    ignores: ["dist/**", "storybook-static/**", "coverage/**", "node_modules/**"],
  },
  {
    files: ["src/**/*.ts", "stories/**/*.ts", "test/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      lit,
      wc,
    },
    rules: {
      ...wc.configs["flat/recommended"].rules,
      ...lit.configs["flat/recommended"].rules,
    },
  },
];
