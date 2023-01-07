const router = require("express").Router()
const { Op, Sequelize, or } = require('sequelize');
const { pool, sequelize } = require('../db.js')

router.get('/region/county', async (req, res) => {
  try {
    const counties = await pool.query(`SELECT countyeng
    FROM taiwan_county
    ORDER BY countyeng`)
    res.json(counties.rows)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: 'Internal Server Error' })
  }
})

// router.get('/regions/counties/:countyId/towns', async (req, res) => {
//   try {
//     const counties = await pool.query(`SELECT countyeng
//     FROM taiwan_county
//     ORDER BY countyeng`)
//     res.json(counties.rows)
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: true, message: 'Internal Server Error' })
//   }
// })


module.exports = router;