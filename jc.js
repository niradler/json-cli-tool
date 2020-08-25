#!/usr/bin/env node
const yargs = require("yargs"); // eslint-disable-line
const JC = require(".");
let _pipedData = "";

const argv = yargs.option("path", {
  alias: "p",
  type: "string",
  description: "path to value.",
}).argv;

const main = (pipedData) => {
  const jc = new JC(argv, pipedData);
  jc.process();
};

function withoutPipe() {
  console.log("no content was piped");
}

var self = process.stdin;
self.on("readable", function () {
  var chunk = this.read();
  if (chunk === null) {
    if (!_pipedData) withoutPipe();
  } else {
    _pipedData += chunk;
  }
});

self.on("end", function () {
  main(_pipedData);
});

setTimeout(() => {
  if (!_pipedData) {
    console.log("timeout, piped data is missing.");
    process.exit(1);
  }
}, 500);
