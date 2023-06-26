module.exports = {
  destructure: (str) => {
    /**
     * example :
     * 3 rows: 1st is a centered image, 2nd is three buttons, third is two thirds two rows of text and one third a button :
     * ["Image,500x500,centered","3-Button,space-between","View,2/3,children:[Text,Text];Button"]
     *  */
    let code = "";
    const rows = JSON.parse(str);
    const toCode = (row) => {
      const columns = row.split(";");
      columns.forEach((column) => {
        const component = row.split(",");
        const last_item = component[component.length - 1].split(":");
        const has_children = last_item[0] == "children";
        code += `<${component[0]} ${has_children ? "" : "/"}>`;
        if (has_children) {
          JSON.parse(last_item[1]).forEach(toCode);
          code += `</${component[0]}>`;
        }
      });
    };
    rows.forEach(toCode);
    return code;
  }
};
