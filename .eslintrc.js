module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["airbnb-base", "airbnb-typescript/base", "prettier"],
  plugins: [],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
  },
  rules: {
    semi: ["error", "never"],
    "@typescript-eslint/semi": "off",
    "comma-dangle": "off",
    "@typescript-eslint/comma-dangle": "off",
  },
};
