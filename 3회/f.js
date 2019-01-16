const log = console.log;
const clear = console.clear;
const curry1 = f => (...a) =>
  a.length > 1 ? f(...a) : (...b) => f(a[0], ...b);

const reduce = curry1((f, acc, coll) => {
  if (coll === undefined) {
    coll = acc[Symbol.iterator]();
    acc = coll.next().value;
  }

  for (const item of coll) acc = f(acc, item);

  return acc;
});

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

const map = curry1((f, coll) =>
  reduce((acc, curr) => _push(f(curr), acc), [], coll)
);

const filter = curry1((f, coll) =>
  reduce((acc, curr) => (f(curr) ? _push(curr, acc) : acc), [], coll)
);

const pipe = (f1, ...fns) => (...args) =>
  reduce((acc, f) => f(acc), f1(...args), fns);

const go = (value, ...fns) => pipe(...fns)(value);

function curry(f, len = f.length) {
  return (function recur(prevArgs) {
    return function(...currArgs) {
      const args = [...prevArgs, ...currArgs];
      if (args.length >= len) return f(...args);
      return recur(args);
    };
  })([]);
}

const hi = v => (log(v), v);
