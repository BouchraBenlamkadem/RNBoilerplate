module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./src"],
        extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
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
    ]
  ]
};
