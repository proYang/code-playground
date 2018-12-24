function onlyOnce(fn) {
  return function() {
    if (fn === null) return
    let callFn = fn;
    fn = null;
    callFn.apply(this, arguments);
  }
}

function parallel(tasks, callback) {
  var size, result;
  var completed = 0;
  tasks = Array.from(tasks)
  size = tasks.length
  result = new Array(size).fill()

  tasks.forEach(function (task, index) {
    task(doneWrap(index))
  })
  function doneWrap(index) {
    return onlyOnce(function(res) {
      result[index] = res
      if (++completed === size) {
      	callback(result);
      }
    })
  }

}

module.exports = parallel