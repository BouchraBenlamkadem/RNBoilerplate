const component = require("./generators/component");
const Handlebars = require("handlebars");
const helpers = require("handlebars-helpers")();
const customHelpers = require("./helpers");

// Helpers
Handlebars.registerHelper(helpers);

// Generators
module.exports = function (plop) {
  for (const helper in customHelpers) {
    console.log("hhhhhhhhh", typeof helper, helper, customHelpers[helper]);
    plop.setHelper(helper, customHelpers[helper]);
  }
  plop.setGenerator("component", component);
};
