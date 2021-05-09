const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries.ts')
const port = 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/lines', db.getLines)
app.get('/line/:id', db.getLineById)
app.post('/lines', db.createLine)
app.delete('/line/:id', db.deleteLine)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})