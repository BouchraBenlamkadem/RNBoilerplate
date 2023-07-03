const Handlebars = require("handlebars");
const recursive = require("inquirer-recursive");

const helpers = require("handlebars-helpers")();
const customHelpers = require("./helpers");
const component = require("./generators/component");

// Helpers
Handlebars.registerHelper(helpers);

// Generators
module.exports = function (plop) {
  plop.setPrompt("recursive", recursive);
  for (const helper in customHelpers) {
    plop.setHelper(helper, customHelpers[helper]);
  }
  plop.setGenerator("component", component);
};
