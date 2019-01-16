const log = console.log;
const clear = console.clear;
const add = (a, b) => a + b;

function map(f, iter) {
  let res = [];

  for (const item of iter) {
    res.push(f(item));
  }

  return res;
}

function filter(f, iter) {
  let res = [];

  for (const item of iter) {
    if (f(item)) res.push(item);
  }

  return res;
}