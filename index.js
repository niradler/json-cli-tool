#!/usr/bin/env node
const { hideBin } = require("yargs/helpers");
const cli = require("./cli");

let stdin = process.openStdin();
let timer;
let data = "";

const end = (exitCode = 0) => {
  if (timer) clearTimeout(timer);
  cli(data);

  process.exit(exitCode);
};

stdin.on("data", function (chunk) {
  data += chunk;
});

stdin.on("end", function () {
  try {
    end();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});

timer = setTimeout(() => {
  if (!data) {
    console.error("Missing json data");
    process.exit(1);
  }
}, 3500);

setTimeout(() => {
  if (!data) {
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
    }
  }
}, 500);
