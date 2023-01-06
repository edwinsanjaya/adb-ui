const Pool = require("pg").Pool;
const Sequelize = require("sequelize")


user = "adbgroup7"
password = "pY6LtkcdV4sSr8HqR04t"
host = "adb-database.ctr0cejwu8ze.ap-northeast-1.rds.amazonaws.com"
port = 5432
database = "adb_database"

const pool = new Pool({
  user: user,
  password: password,
  host: host,
  port: port,
  database: database
})

const sequelize = new Sequelize('postgres://'+user+':'+password+'@'+host+':5432/'+database)

module.exports = { pool, sequelize };