require("dotenv").config();
const Pool = require("pg").Pool;
const pool = new Pool({
  user: process.env.POSTGRES_USERNAME,
  host: process.env.POSGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

const getLines = (request, response) => {
  pool.query(
    "SELECT * FROM lines ORDER BY name, variation",
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const getLineById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM lines WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const createLine = (request, response) => {
  const { name, variation, playercolor, moves } = request.body;

  pool.query(
    "INSERT INTO lines (name, variation, playercolor, moves) VALUES ($1, $2, $3, $4)",
    [name, variation, playercolor, moves],
    (error, result) => {
      if (error) {
        throw error;
      }
      response
        .status(201)
        .send(`Line added with name: ${result.name}, variation: ${variation}`);
    }
  );
};

const toggleLine = (request, response) => {
  const { id, selected } = request.body;

  pool.query(
    "UPDATE lines SET selected = $2 WHERE id = $1",
    [id, selected],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Line '${id}' updated with : ${selected}`);
    }
  );
};

const toggleAllLines = (request, response) => {
  const { selected } = request.body;
  pool.query("UPDATE lines SET selected = $1", [selected], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Lines all set to selected: ${selected}`);
  });
};

const deleteLine = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM lines WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Line deleted with id: ${id}`);
  });
};

module.exports = {
  getLines,
  getLineById,
  createLine,
  deleteLine,
  toggleLine,
  toggleAllLines,
};
