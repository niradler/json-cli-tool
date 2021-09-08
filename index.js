#!/usr/bin/env node

const fs = require("fs");
const { hideBin } = require("yargs/helpers");
const cli = require("./cli");

let data = "";

const end = (exitCode = 0) => {
  cli(data);
  process.exit(exitCode);
};

try {
  const stdinBuffer = fs.readFileSync(0);
  data = stdinBuffer.toString();
} catch (error) {
  const argvArr = hideBin(process.argv);
  const terminateOptions = ["help", "--help", "--version"];
  let immediate = false;
  if (Array.isArray(argvArr) && argvArr.length > 0) {
    terminateOptions.some((value) => {
      if (argvArr.find((v) => v == value)) {
        immediate = true;
        return true;
      }
    });
  }
  if (immediate) {
    end();
  } else {
    console.error("Missing json data");
    process.exit(1);
  }
}

(function main(data) {
  try {
    if (data) end();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
})(data);
