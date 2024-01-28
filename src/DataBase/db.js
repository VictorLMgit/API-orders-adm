// src/db.js
const { Pool } = require('pg');


const pool = new Pool({
  user: process.env.LOGIN,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});


module.exports = {
  query: (text, params) => pool.query(text, params),
};
