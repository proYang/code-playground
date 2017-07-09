import path from 'path'
import express from 'express'
import open from  'open'
import { graphql } from 'graphql'
import bodyParser from 'body-parser'
import schema from './schema'

const rootPath = path.join(__dirname, '../dist')
const app = express()
const PORT = 8000

//Parse post content as text
app.use(bodyParser.text({ type: 'application/graphql' }))
app.use(express.static(rootPath))

app.post('/graphql', (req, res) => {
  //GraphQL executor
  console.dir(req)
  graphql(schema, req.body)
  .then((result) => {
    res.send(JSON.stringify(result, null, 2))
  })
});

app.listen(PORT, () => {
  open(`http://127.0.0.1:${PORT}`)
  console.log(`Server is running at localhost:${PORT}`)
})