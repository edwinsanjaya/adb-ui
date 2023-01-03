const router = require("express").Router()
const Supplier = require("../models/Supplier");
const { Op } = require('sequelize');
const { pool, sequelize } = require('../db.js')

router.get('/suppliers/product_id/:product_id', async (req, res) => {
  try {
    const { product_id } = req.params
    const product = await pool.query("SELECT supplier_id, COUNT(*) total_products, (SELECT supplier_name FROM suppliers where suppliers.supplier_id = products.supplier_id) FROM products WHERE product_id = $1 AND supplier_id in (SELECT DISTINCT supplier_id FROM suppliers) GROUP BY supplier_id ORDER BY total_products DESC", [product_id])
    res.json(product.rows)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: 'Internal Server Error' })
  }
})

module.exports = router;