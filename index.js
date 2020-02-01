#!/usr/bin/env node
const minimist = require("minimist");
const get = require("lodash.get");
const set = require("lodash.set");
const querystring = require("querystring");
var _data = "";

const output = (obj, type, limit) => {
  if (limit && Array.isArray(obj)) {
    obj = obj.slice(0, Number(limit));
  }
  switch (type) {
    case "table":
      console.table(obj);
      break;
    case "log":
      console.log(obj);
      break;
    case "stringify":
      console.log(JSON.stringify(obj));
      break;
    default:
      console.log(obj);
      break;
  }
};

const _filter = (obj, term) => {
  return obj.filter(o => {
    let q = {};
    q = transformParams(term);
    q = Object.assign({}, q);
    if (typeof o == "object") {
      const keys = Object.keys(q);
      let isEqual = keys.map(key => {
        return get(o, key) == normalize(get(q, key));
      });

      return !isEqual.some(b => b == false);
    } else {
      return get(q, o) == o;
    }
  });
};

const transformParams = params => {
  return querystring.decode(params);
};

const normalize = value => {
  switch (value) {
    case !isNaN(value):
      value = Number(value);
      break;
    case value == "true":
      value = true;
      break;
    case value == "false":
      value = false;
      break;
  }

  return value;
};

const _map = (fields, data) => {
  if (!Array.isArray(data)) data = [data];
  fields = fields.includes(",") ? fields.split(",") : [fields];

  return data.map(d => {
    const obj = {};
    fields.forEach(f => set(obj, f, get(d, f)));
    return Object.keys(obj).length == 0 ? undefined : obj;
  });
};

function withPipe(data) {
  let json = data.trim();
  try {
    try {
      var j;

      eval(`j=JSON.stringify(${json})`);

      while (typeof j == "string") {
        j = JSON.parse(j);
      }
      json = j;
    } catch (error) {
      console.log(error);
    }

    _data = json;
    const argv = minimist(process.argv.slice(2));
    let obj = json;
    const jsonFormat = argv.output || argv.o;
    const limit = argv.limit || argv.l;

    if (argv.path || argv.p) {
      obj = get(json, argv.path || argv.p, undefined);
    }

    if (argv["_"].length == 1) {
      const cmd = argv["_"][0];
      switch (cmd) {
        case "keys":
          console.log(Object.keys(obj));
          break;
        case "values":
          console.log(Object.values(obj));
          break;
        default:
          console.error("command not found.");
          break;
      }
      return;
    }

    if (typeof obj != "object") output(obj, jsonFormat, limit);
    else {
      if (argv.map || argv.m) {
        let p = argv.map || argv.m;
        obj = _map(p, obj);
      }
      if ((argv.filter || argv.f) && Array.isArray(obj)) {
        let term = argv.filter || argv.f;
        obj = _filter(obj, term);
      }
    }
    if (obj.length && obj.length == 1) obj = obj[0];
    output(obj, jsonFormat, limit);
  } catch (error) {
    console.error("couldn't parsed: " + error.message);
  }
}

function withoutPipe() {
  console.log("no content was piped");
}

var self = process.stdin;
self.on("readable", function() {
  var chunk = this.read();
  if (chunk === null) {
    if (!_data) withoutPipe();
  } else {
    _data += chunk;
  }
});
self.on("end", function() {
  withPipe(_data);
});
