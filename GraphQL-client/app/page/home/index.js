import tpl from './index.hbs'
import { graphql, buildSchema } from 'graphql'

document.querySelector('body').innerHTML = (tpl({
  username: "test"
}))

let schema = buildSchema(`
  type Query {
    hello: String
  }
`)
let root = { hello: () => 'Hello world!' }
graphql(schema, '{hello}', root)
  .then(res => {
    console.log(res)
  })
