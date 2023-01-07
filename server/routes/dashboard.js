const router = require("express").Router()
const { Op, Sequelize, or } = require('sequelize');
const { pool, sequelize } = require('../db.js')

router.get('/dashboard/top-ten-county-by-order', async (req, res) => {
  try {
    const counties = await pool.query("SELECT tc.countyname AS taiwan_county, COUNT(o.rg_id) AS total_order FROM taiwan_county AS tc JOIN orders AS o ON ST_Contains(tc.geom, o.shipping_geom) GROUP BY taiwan_county ORDER BY total_order DESC LIMIT 10")
    res.json(counties.rows)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: 'Internal Server Error' })
  }
})

router.get('/dashboard/top-ten-supplier-by-product', async (req, res) => {
  try {
    const suppliers = await pool.query("SELECT supplier_id,(SELECT supplier_name FROM suppliers WHERE products.supplier_id = suppliers.supplier_id), count(*) total_products FROM products WHERE supplier_id in (SELECT DISTINCT supplier_id FROM suppliers) GROUP BY supplier_id ORDER BY total_products DESC LIMIT 10")
    res.json(suppliers.rows)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: 'Internal Server Error' })
  }
})

router.get('/dashboard/top-ten-supplier-by-order', async (req, res) => {
  try {
    const suppliers = await pool.query("SELECT products.supplier_id AS supplier_id,(SELECT supplier_name FROM suppliers WHERE products.supplier_id = suppliers.supplier_id), count(*) AS total_orders FROM orders INNER JOIN products ON orders.product_id = products.product_id GROUP BY supplier_id ORDER BY total_orders DESC LIMIT 10")
    res.json(suppliers.rows)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: 'Internal Server Error' })
  }
})

router.get('/dashboard/top-ten-county-by-supplier', async (req, res) => {
  try {
    const counties = await pool.query("SELECT tc.countyname AS taiwan_county, Count(s.supplier_id) AS total_supplier FROM taiwan_county AS tc JOIN suppliers AS s ON st_contains(tc.geom, s.supplier_geom) GROUP BY taiwan_county ORDER BY total_supplier DESC LIMIT 10")
    res.json(counties.rows)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: 'Internal Server Error' })
  }
})

router.get('/dashboard/top-ten-town-by-supplier', async (req, res) => {
  try {
    const counties = await pool.query("SELECT tt.townname AS taiwan_town, tc.countyname AS taiwan_county, Count(s.supplier_id) AS total_supplier FROM taiwan_town AS tt JOIN suppliers AS s ON st_contains(tt.geom, s.supplier_geom) LEFT JOIN taiwan_county AS tc ON tt.countyid=tc.countyid GROUP BY taiwan_town, taiwan_county ORDER BY total_supplier DESC LIMIT 10;")
    res.json(counties.rows)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: 'Internal Server Error' })
  }
})

module.exports = router;