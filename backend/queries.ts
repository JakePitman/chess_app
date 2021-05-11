require('dotenv').config();
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'chessrole',
  host: 'localhost',
  database: 'chessapp',
  password: process.env.DB_PASSWORD,
  port: 5432,
})
const getLines = (request, response) => {
  pool.query('SELECT * FROM lines', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getLineById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM lines WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createLine = (request, response) => {
  const { name, moves } = request.body

  pool.query('INSERT INTO lines (name, moves) VALUES ($1, $2)', [name, moves], (error, result) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Line added with ID: ${result.insertId}`)
  })
}

const deleteLine = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM lines WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Line deleted with ID: ${id}`)
  })
}

module.exports = {
  getLines,
  getLineById,
  createLine,
  deleteLine,
}