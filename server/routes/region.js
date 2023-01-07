const router = require("express").Router()
const { Op, Sequelize, or } = require('sequelize');
const { pool, sequelize } = require('../db.js')

module.exports = router;