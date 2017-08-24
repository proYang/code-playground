const cloneDeep = require('./cloneDeep')

var b = {
  link: '2'
}

var user = {
  name: "user",
  settings: {
    first: "1",
    second: [1, 2, 3, 4, b],
    b: b
  }
}



let user2 = cloneDeep(user)

console.dir(user)
console.dir(user2)
console.log(user === user2)