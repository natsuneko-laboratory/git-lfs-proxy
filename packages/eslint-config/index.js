const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

module.exports = {
  extends: [
    "airbnb-base",
    "airbnb-typescript/base",
    "plugin:import/typescript",
    "eslint-config-prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project,
  },
  ignorePatterns: ["node_modules/", "dist/"],
};
