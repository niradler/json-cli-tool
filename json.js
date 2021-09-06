const get = require("lodash.get");
const set = require("lodash.set");
const querystring = require("querystring");
const jPath = require("jmespath");

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
    case "newline":
      console.log(
        obj
          .map((v) => Object.values(v))
          .flat()
          .join("\n")
      );
      break;
    default:
      console.log(obj);
      break;
  }
};

const filterFn = (obj, term) => {
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
};

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

const mapFn = (fields, data, flat) => {
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
};

const parse = (data) => {
  let json = data.trim();
  return JSON.parse(json);
};

const getFn = (data, path, defaultValue = undefined) => {
  return get(data, path, defaultValue);
};

const search = (data, query, defaultValue = undefined) => {
  return jPath.search(data, query) || defaultValue;
};

module.exports = {
  filter: filterFn,
  map: mapFn,
  normalize,
  transformParams,
  output,
  parse,
  search,
  get: getFn,
};
