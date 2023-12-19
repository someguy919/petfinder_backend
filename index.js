const pg = require('pg');
const cors = require('cors');
const express = require('express');

const app = express();
const PORT = 8080;

app.use(cors());

const connectionString = 'postgres://localhost/acme_backend_dbz';
const client = new pg.Client(connectionString);

const init = async () => {
  try {
    await client.connect();
    console.log("Connected to database");

    const SQL = `
      DROP TABLE IF EXISTS pets;
      CREATE TABLE pets (
        id SERIAL PRIMARY KEY,
        name VARCHAR(20),
        is_favorite BOOLEAN DEFAULT false
      );
      INSERT INTO pets (name) VALUES ('cat1');
      INSERT INTO pets (name, is_favorite) VALUES ('cat2', true);
      INSERT INTO pets (name) VALUES ('cat3');
      INSERT INTO pets (name) VALUES ('cat4');
      INSERT INTO pets (name) VALUES ('BATMAN');
    `;

    await client.query(SQL);
    console.log("Table created!");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

init();

app.get('/api/pets', async (req, res, next) => {
  try {
    const SQL = `
      SELECT * 
      FROM pets
    `;

    const response = await client.query(SQL);
    console.log(response.rows);
    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});
