// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:eslint/recommended",
    "plugin:prettier/recommended"
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: "module"
  },
  plugins: ["react"],
  ignorePatterns: ["**/*.md"],
  rules: {
    indent: ["error", "tab"],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "always"]
  },
  settings: {
    "import/resolver": {
      node: {
        paths: ["src"],
        alias: {
          assets: "./src/assets",
          contexts: "./src/contexts",
          components: "./src/components",
          config: "./src/config",
          utils: "./src/utils",
          mockdata: "./src/mockdata",
          helpers: "./src/utils/helpers",
          _constants: "./src/utils/constants",
          services: "./src/services",
          store: "./src/store",
          models: "./src/models",
          navigations: "./src/navigations",
          screens: "./src/screens",
          styles: "./src/styles",
          animations: "./src/animations",
          templates: "./src/templates",
          icons: "./src/assets/icons",
          fonts: "./src/assets/fonts",
          slices: "./src/slices"
        }
      }
    }
  }
};
