const log = console.log;
const clear = console.clear;
const add = (a, b) => a + b;

function reduce(f, acc, coll) {
  if (coll === undefined) {
    coll = acc[Symbol.iterator]();
    acc = coll.next().value;
  }

  for (const item of coll) acc = f(acc, item);

  return acc;
}

const _set = (key, val, obj = {}) => ((obj[key] = val), obj);
const _push = (val, arr = []) => (arr.push(val), arr);

const _makeBy = f => (getKey, coll) =>
  reduce((acc, curr) => f(acc, curr, getKey(curr)), {}, coll);

const groupBy = _makeBy((acc, curr, key) =>
  _set(key, _push(curr, acc[key]), acc)
);

const countBy = _makeBy((acc, curr, key) =>
  _set(key, (acc[key] || 0) + 1, acc)
);

const indexBy = _makeBy((acc, curr, key) => _set(key, curr, acc));

const map = (f, coll) => reduce((acc, curr) => _push(f(curr), acc), [], coll);

const filter = (f, coll) =>
  reduce((acc, curr) => (f(curr) ? _push(curr, acc) : acc), [], coll);