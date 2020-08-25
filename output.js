#!/usr/bin/env node
console.log(
  JSON.stringify({
    a: 1,
    b: 2,
    c: [1, 2, 3, 4, 5],
    d: { a: 2, b: 3 },
    e: [
      { a: 1, b: 2, c: [1, 2, 3, 4, 5], d: { a: 2, b: 5 } },
      { a: 2, b: 3, c: [1, 2, 3, 4, 5], d: { a: 2, b: 4 } }
    ]
  })
);
