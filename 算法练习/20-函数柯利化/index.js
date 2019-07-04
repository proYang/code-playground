/**
 * 函数柯利化
 */

const sum = (a, b, c) => {
  return a + b + c
}

function curry(fn) {
  let args = [];
  let that = this;
  function callback () {
    args = [...args, ...arguments];
    if(args.length >= fn.length) {
      return fn.apply(that, args)
    } else {
      return callback;
    }
  }
  return callback;
}

const sumCurry = curry(sum)
// console.log(addCurry(1, 2, 3))
// addCurry(1, 2)(3)
// console.log(addCurry(1)(2)(3))
console.log(sumCurry(1, 2)(3))
// console.log(addCurry(1)(2))
// console.log(addCurry(1))
// console.log(addCurry(2))
// console.log(addCurry(3))
// console.log(addCurry(4))