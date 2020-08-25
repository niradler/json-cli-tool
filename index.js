#!/usr/bin/env node
const get = require("lodash.get");
const set = require("lodash.set");
const querystring = require("querystring");

const transformParams = (params) => {
  return querystring.decode(params);
};

const normalize = (value) => {
  switch (value) {
    case "true":
      value = true;
      break;
    case "false":
      value = false;
      break;
    default:
      if (!isNaN(value)) value = Number(value);
  }

  return value;
};

class JC {
  constructor(argv, jsonString) {
    this.json = this.clean(jsonString.trim());
    this.argv = argv;
  }

  clean(json) {
    var j = json;
    try {
      eval(`j=JSON.stringify(${j})`);

      while (typeof j == "string") {
        j = JSON.parse(j);
      }
    } catch (error) {}

    return j;
  }

  process() {
    const json = this.json;
    const argv = this.argv;
    let obj = { ...json };
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
          console.error("command not found: ", cmd);
          break;
      }
      return;
    }

    if (typeof obj != "object") this.output(obj, jsonFormat, limit);
    else {
      if (argv.map || argv.m) {
        let p = argv.map || argv.m;
        obj = this.map(p, obj);
      }
      if ((argv.filter || argv.f) && Array.isArray(obj)) {
        let term = argv.filter || argv.f;
        obj = this.filter(obj, term);
      }
      if (argv.flatMap || argv.fm) {
        let p = argv.flatMap || argv.fm;
        obj = this.map(p, obj, true);
      }
    }
    if (Array.isArray(obj) && obj.length == 1) obj = obj[0];

    this.output(obj, jsonFormat, limit);
  }
  catch(error) {
    console.error("couldn't parsed: " + error.message);
  }

  map(fields, data, flat) {
    if (!Array.isArray(data)) data = [data];
    fields = fields.includes(",") ? fields.split(",") : [fields];

    return data.map((d) => {
      if (flat) {
        return get(d, fields[0]);
      } else {
        const obj = {};
        fields.forEach((f) => set(obj, f, get(d, f)));
        return Object.keys(obj).length == 0 ? undefined : obj;
      }
    });
  }

  output(obj, type, limit) {
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
      case "newline":
        console.log(
          obj
            .map((v) => (Object.values(v).length > 0 ? Object.values(v) : v))
            .flat()
            .join("\n")
        );
        break;
      default:
        console.log(obj);
        break;
    }
  }

  filter(obj, term) {
    return obj.filter((o) => {
      let q = {};
      q = transformParams(term);
      q = Object.assign({}, q);
      if (typeof o == "object") {
        const keys = Object.keys(q);
        let isEqual = keys.map((key) => {
          return get(o, key) == normalize(get(q, key));
        });

        return !isEqual.some((b) => b == false);
      } else {
        return get(q, o) == o;
      }
    });
  }
}

module.exports = JC;
