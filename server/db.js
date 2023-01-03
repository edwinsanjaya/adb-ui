const Pool = require("pg").Pool;
const Sequelize = require("sequelize")

const pool = new Pool({
  user: "postgres",
  password: "admin",
  host: "localhost",
  port: 5432,
  database: "adb_final"
})

const sequelize = new Sequelize('postgres://postgres:admin@localhost:5432/adb_final')

module.exports = { pool, sequelize };