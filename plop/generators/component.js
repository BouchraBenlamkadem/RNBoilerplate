const fs = require("fs");
const path = require("path");

module.exports = {
  description: "Generate a component",
  prompts: [
    {
      type: "input",
      name: "module",
      message: "Module name:"
    },
    {
      type: "input",
      name: "component",
      message: "Component name:"
    },
    {
      type: "list",
      name: "fileType",
      message: "Select the file type:",
      choices: ["JavaScript", "TypeScript"],
      default: "TypeScript"
    },
    {
      type: "checkbox",
      name: "RNComponents",
      message: "Select React Native components to import:",
      choices: ["View", "Text", "Button", "Image", "TextInput"]
    },
    {
      type: "checkbox",
      name: "CommonComponent",
      message: "Select Common components to import:",
      choices: (_) => {
        const componentPath = "../src/components/Common";
        const componentFiles = fs.readdirSync(componentPath);
        const componentNames = componentFiles.map((file) =>
          path.basename(file, path.extname(file))
        );
        return componentNames;
      }
    },
    {
      type: "input",
      name: "structure",
      message: "Enter the component structure (e.g., View>ScrollView>View,Text,Image):"
    }
  ],
  actions: function (data) {
    const modulePath = `../src/components/${data.module}`;
    const testPath = modulePath.replace("src", "__tests__");

    const templateExtension = data.fileType === "TypeScript" ? "tsx" : "jsx";

    const actions = [
      {
        type: "add",
        path: `${modulePath}/{{pascalCase component}}.${templateExtension}`,
        templateFile: `templates/Component.hbs`
      },
      {
        type: "add",
        path: `${testPath}/{{pascalCase component}}.test.${templateExtension}`,
        templateFile: "templates/Component.test.hbs"
      }
    ];

    return actions;
  }
};
