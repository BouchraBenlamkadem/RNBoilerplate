import SQLite from "react-native-sqlite-storage";

SQLite.enablePromise(true);

export const DATABASE = "IWASALES";

export const TABLE = "TABLE";

export const MAX_QUERY_PARAMETERS = 999;

/**
 * Executes a query and returns results array
 * @param {string} query
 * @param {array} params
 * @returns {array} results - format : { isSuccessful: false, insertId: null, rows: [] }
 */
export async function ExecuteQuery(query:any, params = []) {
  const DB = await SQLite.openDatabase(
    {name:DATABASE},
    () => {},
    (error) => /*console.log(error)*/ {}
  );
  const rows:Array<any>=[]
  const insertId:any= null;
  let query_result = { isSuccessful: false, insertId, rows };
  try {
    await DB.transaction(async (transaction) => {
      await transaction.executeSql(
        query,
        params,
        (_, result) => {
          query_result.isSuccessful = true;
          for (let i = 0; i < result.rows.length; i++) {
            query_result.rows.push(result.rows.item(i));
          }
          query_result.insertId = result.insertId;
        },
        (error) => {
          console.log(error);
        }
      );
    });
  } catch (error) {
    console.log(error);
  }
  return query_result;
}

/**
 *
 * @param {string[]} queries
 * @param {array} params
 * @returns {array} results - format : { isSuccessful: false, insertId: null, rows: [] }
 */
export async function ExecuteQueries(queries:any, params = []) {
  const DB = await SQLite.openDatabase(
    {name:DATABASE},
    () => {},
    (error) => /*console.log(error)*/ {}
  );
  const rows:Array<any>=[]
  const insertId:any= null;
  let queries_result = { isSuccessful: false, insertId, rows };
  DB.transaction(async (transaction) => {
    queries.forEach(async (query:any) => {
      await transaction.executeSql(
        query,
        params,
        (_, result) => {
          for (let i = 0; i < result.rows.length; i++) {
            queries_result.rows.push(result.rows.item(i));
          }
          queries_result.insertId = result.insertId;
        },
        (error) => {
          //console.log(`error ${query}`+error);
        }
      );
    });
  })
    .then((_) => {
      //console.log('then');
      queries_result.isSuccessful = true;
      return queries_result;
    })
    .catch((error) => {
      //console.log(`error ${query}`+error);
      queries_result.isSuccessful = false;
      return queries_result;
    });
}

/**
 *  CREATE TABLE from table name and columns list
 * @param {string} table
 * @param {JSON[]} columns - format : [{ name:"id", type: "INTEGER", options:"PRIMARY KEY NOT NULL" }, ... ]
 * @param {JSON[]} foreignKeys - format : [{ key : 'foreignId' , table: 'foreign', distantKey : 'Id' },...]
 */
export async function createTable(table:String, columns:Array<any>, foreignKeys:Array<any> = []) {
  columns = columns.map((column) => {
    const name = prefixColumnName(table, column.name);
    const type = column.type;
    const options = column.options;
    return `${name} ${type} ${options}`;
  });
  foreignKeys = foreignKeys.map((foreignKey) => {
    const key = prefixColumnName(table, foreignKey.key);
    const foreign_table = foreignKey.table;
    const distantKey = prefixColumnName(foreign_table, foreignKey.distantKey);
    return `FOREIGN KEY(${key}) REFERENCES ${foreign_table}(${distantKey})`;
  });
  let query = `CREATE TABLE IF NOT EXISTS ${table} (${[...columns, ...foreignKeys].join(",")}) `;
  const result = await ExecuteQuery(query);
  return result;
}

/**
 * INSERT INTO TABLE from table name, columns list, and values
 * @param {string} table
 * @param {string[]} columns
 * @param {array} values
 */
export async function insert(table:String, columns:Array<any>, values:any) {
  columns = columns.map((column) => prefixColumnName(table, column));
  let columns_string = columns.join(",");
  let query = `INSERT INTO ${table} (${columns_string}) VALUES (${columns_string
    .replace(/'/g, "")
    .replace(/"\b[\w]+\b"/g, "?")})`;
  const result = await ExecuteQuery(query, values);
  return result;
}
/**
 * BULK INSERT : INSERT INTO TABLE from table name, columns list, and values
 * @param {string} table
 * @param {string[]} columns
 * @param {array[]} values
 */
export async function insertBulk(table:String, columns:Array<any>, values:any) {
  columns = columns.map((column) => prefixColumnName(table, column));
  const columns_string = columns.join(",");
  const values_string_base =
    "(" + columns_string.replace(/_/g, "").replace(/"\b[\w]+\b"/g, "?") + ")";
  const values_string =
    values.length > 1 ? values.map((_) => values_string_base).join(",") : values_string_base;
  const query = `INSERT INTO ${table} (${columns_string}) VALUES ${values_string}`;
  const result = await ExecuteQuery(query, values.flat());
  return result;
}

/**
 *
 * @param {string} table
 * @param {string[]} columns
 * @param {string} conditions
 * @param {string} SQLOptions
 */
export async function select(table:String, columns:Array<String> = [], conditions = "", SQLOptions = "") {
  columns = columns.map((column) => prefixColumnName(table, column));
  const columns_string = columns.length === 0 ? "*" : columns.join(",");
  const query = `SELECT ${columns_string} FROM ${table} ${conditions} ${SQLOptions}`;
  const result = await ExecuteQuery(query);
  const rows = result.rows.map((row) => removeRowPrefix(table, row));
  return { ...result, rows };
}
/**
 *
 * @param {string[]} tables
 * @param {string} join
 * @param {string} on
 * @param {string[][]|string[]} columns
 * @param {string} conditions
 * @param {string} SQLOptions
 * @param {string} join_key - result rows' key in which joined table values are stored as an object
 */
export async function selectJoined(
  tables:Array<String>,
  join:String,
  on:String,
  columns:Array<any> = [[], []],
  conditions = "",
  SQLOptions = "",
  join_key = ""
) {
  const left_table = tables[0];
  const right_table = tables[1];
  let left_table_columns = Array.isArray(columns[0]) ? columns[0] : columns;
  let right_table_columns:any = Array.isArray(columns[1]) ? columns[1] : null;

  left_table_columns = left_table_columns.map(
    (column) => left_table + "." + prefixColumnName(left_table, column)
  );
  right_table_columns = right_table_columns?.map(
    (column:any) => right_table + "." + prefixColumnName(right_table, column)
  );

  const left_table_columns_string =
    left_table_columns.length === 0 ? `${left_table}.*` : left_table_columns.join(",");
  const right_table_columns_string = right_table_columns
    ? right_table_columns.length === 0
      ? `, ${right_table}.*`
      : "," + right_table_columns.join(",")
    : "";
  const columns_string = left_table_columns_string + right_table_columns_string;

  const query = `SELECT ${columns_string} FROM ${left_table} ${join} ${right_table} ON ${on} ${conditions} ${SQLOptions}`;
  const result = await ExecuteQuery(query);
  const rows = result.rows.map((row) => adjustJoinedResult(left_table, right_table, row, join_key));
  return { ...result, rows };
}

/**
 * DROP TABLE
 * @param {string} table
 */
export async function dropTable(table:String) {
  const result = await ExecuteQuery(`DROP TABLE IF EXISTS ${table}`);
  return result;
}
/**
 * deletes rows from table
 * @param {string} table
 */
export async function deleteRows(table:String, condition = "") {
  const result = await ExecuteQuery(`DELETE FROM ${table} ${condition}`);
  return result;
}
/**
 * updates rows in table
 * @param {string} table
 */
export async function update(table:String, columns:Array<any> , condition = "") {
  const result = await ExecuteQuery(
    `UPDATE ${table} SET ${columns.map((column) => `"${column}"=?`).join(", ")} ${condition}`
  );
  return result;
}

/**
 * DROP & CREATE TABLE in a single transaction
 * @param {string} table
 * @param {JSON[]} columns
 */
export async function reinitiateTable(table:String, columns:Array<any> ) {
  const drop_query = `DROP TABLE IF EXISTS ${table}`;
  let create_query = `CREATE TABLE IF NOT EXISTS ${table} (`;
  for (const [index, field] of columns.entries()) {
    const name = prefixColumnName(table, field.name);
    const type = field.type;
    const options = field.options;
    create_query += `${name} ${type} ${options}`;
    if (index !== columns.length - 1) create_query += ", ";
    else create_query += ")";
  }
  const result = await ExecuteQueries([drop_query, create_query]);
  return result;
}

/**
 * @summary Adds prefix to column using table name
 * @description
 * - Format : "table_column"
 * - Use : To avoid bugs due to column names equal to restricted keywords in SQLite
 * @param {string} table
 * @param {string} column
 * @returns {string}
 */
export function prefixColumnName(table:String, column:String) {
  return `"${column}"`;
  // return table + "_" + column;
}

/**
 * Deletes prefix from row object properties
 * @param {string} table
 * @param {JSON} row
 * @returns {JSON}
 */
export function removeRowPrefix(table:String, row:any) {
  // const object = {};
  // for (const [key, value] of Object.entries(row)) {
  //   const new_key = key.replace(`${table}_`, "");
  //   object[new_key] = value;
  // }
  // return object;
  return row;
}
/**
 *
 * @param {string} left_table
 * @param {string} right_table
 * @param {JSON} row
 * @returns {JSON}
 */
export function adjustJoinedResult(left_table:String, right_table:String, row:any, column:any) {
  const object = {};
  const foreign = {};
  const new_row = removeRowPrefix(right_table, row);
  for (const [key, value] of Object.entries(new_row)) {
    if (key in row) object[key] = value;
    else foreign[key] = value;
  }
  object[column] = foreign;
  return removeRowPrefix(left_table, object);
}
