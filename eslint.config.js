import globals from "globals";
import js from "@eslint/js";
import * as tseslint from "@typescript-eslint/eslint-plugin";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier";

export default [
  // Global ignores
  {
    ignores: ["dist/", "build/", "node_modules/", "*.config.js"],
  },

  // Base ESLint recommended rules
  js.configs.recommended,

  // TypeScript recommended rules
  tseslint.configs.recommended,
  tseslint.configs.stylistic,

  // React recommended rules
  pluginReact.configs.recommended,
  pluginReactHooks.configs.recommended,

  {
    // Configuration for all files
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./tsconfig.json"], // Specify your tsconfig.json for type-aware linting
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: "detect", // Automatically detect the React version
      },
    },
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      prettier: eslintPluginPrettier,
    },
    rules: {
      // Custom rules or overrides
      "react/react-in-jsx-scope": "off", // Not needed for React 17+ with new JSX transform
      "react/prop-types": "off", // Disable if using TypeScript for prop-types
      "prettier/prettier": "error", // Report Prettier issues as ESLint errors
      "arrow-body-style": "off", // Example: disable a rule that might conflict with Prettier's preferences
      "prefer-arrow-callback": "off", // Example: disable another rule
    },
  },

  // Ensure prettier config is last to disable conflicting rules
  eslintConfigPrettier,
];