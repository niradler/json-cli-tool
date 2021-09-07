const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const json = require("./json");
const path = require("path");
const fs = require("fs");

const cli = (data) => {
  const argv = yargs(hideBin(process.argv))
    .command(
      "keys",
      "Object keys",
      (yargs) => {},
      (argv) => {}
    )
    .example([['$0 keys --path="cars"', "Goto .cars, and Print keys"]])
    .command(
      "values",
      "Object values",
      (yargs) => {},
      (argv) => {}
    )
    .example([['$0 values --path="names"', "Goto .names, and Print values"]])
    .option("path", {
      alias: "p",
      type: "string",
      describe: "path in json",
      description: "path in json",
    })
    .option("filter", {
      alias: "f",
      type: "string",
      describe: "Filter array function",
      description: "Filter array function",
    })
    .option("map", {
      alias: "m",
      type: "string",
      describe: "Map array function",
      description: "Map array function",
    })
    .option("query", {
      alias: "q",
      type: "string",
      describe: "Query json using jamespath",
      description: "Query json using jamespath",
    })
    .option("output", {
      alias: "o",
      describe: "Output format",
      description: "Output format",
      default: "log",
      choices: ["table", "log", "stringify", "newline", "env", "count"],
    })
    .option("limit", {
      alias: "l",
      type: "number",
      description: "Limit array size",
      describe: "Limit array size",
    })
    .option("flatMap", {
      alias: "fm",
      type: "string",
      description: "Flatmap array function",
      describe: "Flatmap array function",
    })
    .option("config", {
      alias: "c",
      type: "string",
      description: "config file path",
      describe: "config file path",
    })
    .usage('$0 [keys|values] --path="cars"')
    .help("help")
    .scriptName("jc")
    .fail(function (msg, err, yargs) {
      if (err) throw err; // preserve stack
      console.error("You broke it!");
      console.error(msg);
      console.error("You should be doing", yargs.help());
      process.exit(1);
    }).argv;

  let params = argv;
  if (argv.config) {
    let filePath = path.normalize(argv.config);
    const isAbsolute = path.isAbsolute(filePath);
    filePath = isAbsolute ? filePath : path.join(process.cwd(), filePath);
    params = { ...JSON.parse(fs.readFileSync(filePath)), ...params };
  }

  let jsonObject = json.parse(data);
  if (params.path) {
    jsonObject = json.get(jsonObject, params.path, undefined);
  } else if (params.query) {
    jsonObject = json.search(jsonObject, params.query, undefined);
  }

  if (Array.isArray(params["_"]) && params["_"].length === 1) {
    switch (params["_"][0]) {
      case "keys":
        jsonObject = Object.keys(jsonObject);
        break;
      case "values":
        jsonObject = Object.values(jsonObject);
        break;
      default:
        console.error("Unknown command!");
        process.exit(1);
        break;
    }
  }

  if (typeof jsonObject === "object") {
    if (params.map) {
      jsonObject = json.map(params.map, jsonObject);
    }
    if (params.flatMap) {
      jsonObject = json.map(params.flatMap, jsonObject, true);
    }
    if (params.filter && Array.isArray(jsonObject)) {
      jsonObject = json.filter(jsonObject, params.filter);
    }
  }
  if (Array.isArray(jsonObject) && jsonObject.length == 1) {
    jsonObject = jsonObject[0];
  }

  json.output(jsonObject, params.output, params.limit);
  return params;
};

module.exports = cli;
