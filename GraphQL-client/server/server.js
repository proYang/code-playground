import path from 'path'
import express from 'express'
import open from 'open'
import { graphql } from 'graphql'
import graphqlHTTP from 'express-graphql'
import bodyParser from 'body-parser'
import schema from './schema/schema'

const rootPath = path.join(__dirname, '../dist')
const app = express()
const PORT = 8000

// 分发静态资源
app.use(express.static(rootPath))

app.use(bodyParser.text({ type: 'application/graphql' }))
app.use('/graphql', graphqlHTTP({ schema: schema, pretty: true }))

app.listen(PORT, () => {
  open(`http://127.0.0.1:${PORT}`)
  console.log(`Server is running at localhost:${PORT}`)
})