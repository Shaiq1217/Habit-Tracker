import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin"; // Correct import path for TypeScript ESLint plugin
import tsParser from "@typescript-eslint/parser"; // Correct parser for TypeScript files

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: globals.node,
      parser: tsParser, // Specify parser for TypeScript
    },
    settings: {},
    rules: {
      // Include custom rules here if necessary
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }], // Allow unused args if prefixed with _
      indent: ["error", 2], // Example rule for indentation
      quotes: ["error", "single"], // Enforce single quotes
    },
  },
  pluginJs.configs.recommended,
  tseslint.configs.recommended, // No need to spread if this is an object
];
