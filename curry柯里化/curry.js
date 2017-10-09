function curry(fn) {
    let _argLen = fn.length
    function wrap() {
        let _args = [...arguments]
        function act() {
            _args = [..._args,...arguments]
            if (_args.length === _argLen) {
                return fn.apply(null, _args)
            }
            return act
        }
        if (_args.length === _argLen) {
            return fn.apply(null, _args)
        }

        act.toString = function () {
            return fn.toString()
        }
        return act
    }
    return wrap
}

module.exports = curry