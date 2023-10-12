const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

module.exports = {
  extends: ["airbnb-base", "eslint-config-prettier"],
  ignorePatterns: ["node_modules/", "dist/"],
  overrides: [
    {
      files: ["**/*.ts"],
      extends: [
        "airbnb-base",
        "airbnb-typescript-base",
        "plugin:import/typescript",
        "eslint-config-prettier",
      ],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project,
      },
      rules: {
        "linebreak-style": ["off"],
        "no-restricted-syntax": ["off"],

        "import/prefer-default-export": ["off"],
      },
    },
  ],
};
