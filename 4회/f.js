const log = console.log;
const clear = console.clear;

const add = curry((a, b) => a + b);
const multiply = curry((a, b) => a * b);
const equals = curry((a, b) => a === b);
const prop = curry((key, obj) => obj[key]);
const propEq = curry((key, val, obj) => go(obj, prop(key), equals(val)));

const curry1 = f => (...a) =>
  a.length > 1 ? f(...a) : (...b) => f(a[0], ...b);

const reduce = curry((f, acc, coll) => {
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

const _ = Symbol("parameter");
const ___ = Symbol("rest parameters");

function* reverseIter(iter) {
  const arr = iter instanceof Array ? iter : [...iter];
  for (let i = arr.length - 1; i > -1; i--) yield arr[i];
}

function partial(f, ...args1) {
  return function(...args2) {
    const left = [],
      right = [];
    const args1Iter = args1[Symbol.iterator]();
    const args2Iter = args2[Symbol.iterator]();

    for (const arg of args1Iter) {
      if (arg === ___) break;
      left.push(arg === _ ? args2Iter.next().value : arg);
    }

    const args2ReverseIter = reverseIter(args2Iter);
    for (const arg of reverseIter(args1Iter)) {
      right.unshift(arg === _ ? args2ReverseIter.next().value : arg);
    }

    const restArgs = reverseIter(args2ReverseIter);
    return f(...[...left, ...restArgs, ...right]);
  };
}
