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
      choices: ["View", "Text", "Button", "Image", "TextInput", "TouchableOpacity"]
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
    // {
    //   type: "input",
    //   name: "structure",
    //   message: "Enter the component structure (e.g., View>ScrollView>View,Text,Image):"
    // },
    {
      type: "input",
      name: "root",
      message: "Enter the root component"
    },
    {
      type: "confirm",
      name: "addStyle",
      message: "Do you want to add styles to the component?",
      default: false
    },
    {
      type: "input",
      name: "margin",
      message: "Enter the margin value:",
      when: (answers) => answers.addStyle
    },
    {
      type: "input",
      name: "padding",
      message: "Enter the padding value:",
      when: (answers) => answers.addStyle
    },
    {
      type: "input",
      name: "props",
      message: "Enter the props to add :"
    },
    {
      type: "confirm",
      name: "setContainerAsRow",
      message: "Set container as row?",
      when: (answers) => ["View", "TouchableOpacity"].includes(answers.root)
    },
    {
      type: "recursive",
      message: "Add a child ?",
      name: "children",
      prompts: [
        {
          type: "input",
          name: "name",
          message: "Enter the component name"
        },
        {
          type: "confirm",
          name: "addStyle",
          message: "Do you want to add styles to the component?",
          default: false
        },
        {
          type: "input",
          name: "margin",
          message: "Enter the margin value:",
          when: (answers) => answers.addStyle
        },
        {
          type: "input",
          name: "padding",
          message: "Enter the padding value:",
          when: (answers) => answers.addStyle
        },
        {
          type: "input",
          name: "props",
          message: "Enter the props to add :"
        },
        {
          type: "confirm",
          name: "setContainerAsRow",
          message: "Set container as row?",
          when: (answers) => ["View", "TouchableOpacity"].includes(answers.name)
        }
      ]
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
