function *valuesIter(obj) {
  for (const k in obj) yield obj[k];
}

const add = (a, b) => a + b;

const getIter = coll => 
  coll[Symbol.iterator] && coll[Symbol.iterator].constructor === Function ?
    coll[Symbol.iterator]() :
    valuesIter(coll)

// 1. reduce

function reduce(f, coll, acc) {
  const iter = getIter(coll);
  acc = acc === undefined ? iter.next().value : acc;
  
  for (const v of iter) {
    acc = f(acc, v);
  }

  return acc;
}

// test case 1: array
console.log(
  reduce(add, [1,2,3], 5)
)

// test case2: array with initial value
console.log(
  reduce(add, [1,2,3])
)

// test case3: object
console.log(
  reduce(add, {a: 1, b: 3})
)


// test case3: object with initial value
console.log(
  reduce(add, {a: 1, b: 3}, 4)
)

// countBy

// groupBy

// map

// filter
