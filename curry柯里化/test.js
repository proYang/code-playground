const curry = require('./curry')

// 示例一、形参数目固定
function add(a, b, c, d) {
    return a + b + c + d
}
var adder = curry(add)
console.log(adder(1, 2, 3, 4))
console.log(adder(1)(2)(3, 3))
console.log(adder(1)(2)(3, 3) + '20')

// 示例二、形参数目不固定
// 此方案在NodeJS中toString方法未执行，浏览器有效。

function add2() {
    let _args = [...arguments]
    function wrap() {
        function pushArgs() {
            _args = [..._args, ...arguments]
            return pushArgs
        }
        pushArgs.toString = function () {
            _args.reduce((a, b) => a + b)
        }
        return pushArgs
    }
    return wrap.apply(null, _args)
}
console.log(add2(1, 2)(2, 3, 4, 5)(1))
