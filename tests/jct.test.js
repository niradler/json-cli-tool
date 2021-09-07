const execa = require("execa");

test("Path test", async () => {
  const { stdout } = await execa("npm", [
    "run",
    "parse",
    "-s",
    "--",
    '--path="e[0].d"',
    '--output="stringify"',
  ]);

  expect(stdout).toBe(JSON.stringify({ a: 2, b: 5 }));
});

test("Query test", async () => {
  const { stdout } = await execa("npm", [
    "run",
    "parse",
    "-s",
    "--",
    '--query="e[0].d"',
    '--output="stringify"',
  ]);

  expect(stdout).toBe(JSON.stringify({ a: 2, b: 5 }));
});

test("Config test", async () => {
  const { stdout } = await execa("npm", [
    "run",
    "parse",
    "-s",
    "--",
    '--config="./tests/test.config.json"',
    '--output="stringify"',
  ]);

  expect(stdout).toBe(JSON.stringify({ a: 2 }));
});

test("Filter test", async () => {
  const { stdout } = await execa("npm", [
    "run",
    "parse",
    "-s",
    "--",
    '--path="e"',
    "--filter='a=2&b=3'",
    '--map="a,b"',
    '--output="stringify"',
  ]);

  expect(stdout).toBe(JSON.stringify({ a: 2, b: 3 }));
});

test("Map test", async () => {
  const { stdout } = await execa("npm", [
    "run",
    "parse",
    "-s",
    "--",
    '--path="d"',
    '--map="b"',
    '--output="stringify"',
  ]);

  expect(stdout).toBe(JSON.stringify({ b: 3 }));
});

test("FlatMap test", async () => {
  const { stdout } = await execa("npm", [
    "run",
    "parse",
    "-s",
    "--",
    '--path="e"',
    '--flatMap="d.a"',
    '--output="stringify"',
  ]);

  expect(stdout).toBe(JSON.stringify([2, 2]));
});

test("Limit test", async () => {
  const { stdout } = await execa("npm", [
    "run",
    "parse",
    "-s",
    "--",
    '--path="c"',
    '--limit="3"',
    '--output="stringify"',
  ]);

  expect(stdout).toBe(JSON.stringify([1, 2, 3]));
});

test("Keys test", async () => {
  const { stdout } = await execa("npm", [
    "run",
    "parse",
    "-s",
    "--",
    "keys",
    '--path="d"',
    '--output="stringify"',
  ]);

  expect(stdout).toBe(JSON.stringify(["a", "b"]));
});

test("Values test", async () => {
  const { stdout } = await execa("npm", [
    "run",
    "parse",
    "-s",
    "--",
    "values",
    '--path="d"',
    '--output="stringify"',
  ]);

  expect(stdout).toBe(JSON.stringify([2, 3]));
});
