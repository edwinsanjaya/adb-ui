const router = require("express").Router()
const { Op, Sequelize, or } = require('sequelize');
const { pool, sequelize } = require('../db.js')

router.get('/region/county', async (req, res) => {
  try {
    const counties = await pool.query(`SELECT countyid, countyeng
    FROM taiwan_county
    ORDER BY countyeng`)
    res.json(counties.rows)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: 'Internal Server Error' })
  }
})

router.get('/regions/counties/:countyName/towns', async (req, res) => {
  try {
    const { countyName } = req.params
    const counties = await pool.query(`SELECT towneng FROM taiwan_town
    WHERE countyid = 
          (SELECT countyid 
           FROM taiwan_county 
           WHERE countyeng = $1 
           LIMIT 1)`, [countyName])
    res.json(counties.rows)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: 'Internal Server Error' })
  }
})


module.exports = router;