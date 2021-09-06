const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const json = require("./json");

const cli = (data) => {
  const argv = yargs(hideBin(process.argv))
    .command(
      "keys",
      "Object keys",
      (yargs) => {},
      (argv) => {}
    )
    .example([['$0 jc keys --path="cars"', "Print cars object keys"]])
    .command(
      "values",
      "Object values",
      (yargs) => {},
      (argv) => {}
    )
    .example([
      [
        '$0 jc values --path="names" --map="value"',
        "Goto .names array, and return .value on each key",
      ],
    ])
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
      choices: ["table", "log", "stringify", "newline"],
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

    .usage('$0 [keys|values] --path="cars"')
    .help("help")
    .fail(function (msg, err, yargs) {
      if (err) throw err; // preserve stack
      console.error("You broke it!");
      console.error(msg);
      console.error("You should be doing", yargs.help());
      process.exit(1);
    }).argv;

  let jsonObject = json.parse(data);
  if (argv.path) {
    jsonObject = json.get(jsonObject, argv.path, undefined);
  } else if (argv.query) {
    jsonObject = json.search(jsonObject, argv.query, undefined);
  }

  if (Array.isArray(argv["_"]) && argv["_"].length === 1) {
    switch (argv["_"][0]) {
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
    if (argv.map) {
      jsonObject = json.map(argv.map, jsonObject);
    }
    if (argv.flatMap) {
      jsonObject = json.map(argv.flatMap, jsonObject, true);
    }
    if (argv.filter && Array.isArray(jsonObject)) {
      jsonObject = json.filter(jsonObject, argv.filter);
    }
  }
  if (Array.isArray(jsonObject) && jsonObject.length == 1) {
    jsonObject = jsonObject[0];
  }

  json.output(jsonObject, argv.output, argv.limit);
  return argv;
};

module.exports = cli;
