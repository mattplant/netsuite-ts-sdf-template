import tseslint from "typescript-eslint";
import globals from "globals";
import prettierConfig from "eslint-config-prettier";

export default [
  /**
   * GLOBAL IGNORES (Replacement for .eslintignore)
   * An object with ONLY the 'ignores' key applies globally.
   */
  {
    ignores: [
      "**/node_modules/**",
      "**/src/FileCabinet/SuiteScripts/**", // Stop linting transpiled output
      "**/suitecloud.config.js",            // Ignore SDK configuration
      "**/dist/**",                         // Standard build artifacts
      "**/.git/**"                          // Version control metadata
    ]
  },

  /**
   * TYPESCRIPT SOURCE CONFIG
   */
  {
    files: ["src/TypeScripts/**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      globals: {
        ...globals.node,
        ...globals.es2020,
        // NetSuite globals
        log: "readonly",
        util: "readonly"
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      }
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin
    },
    rules: {
      // Engineering Rigor rules
      "no-unused-vars": "off", // Handled by TS
      "@typescript-eslint/no-unused-vars": ["error"],
      "@typescript-eslint/no-explicit-any": ["error"],
      "@typescript-eslint/explicit-function-return-type": ["error", { allowExpressions: true }],
      "no-console": "error", // Use NetSuite 'log' module instead
      "eqeqeq": ["error", "always"]
    }
  },

  // PRETTIER INTEGRATION (Must be last to override stylistic rules)
  prettierConfig
];

