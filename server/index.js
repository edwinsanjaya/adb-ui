const express = require("express")
const app = express();
const cors = require("cors")
const pool = require("./db")

// Middleware
app.use(cors());
app.use(express.json())

// Routes

app.get("/products", async(req, res) => {
  try {
    const products = await pool.query("SELECT * FROM products LIMIT 100")
    res.json(products.rows)
  } catch (err) {
    console.error(err.message)
  }
})

app.get("/product/:product_id", async(req, res) => {
  try {
    const {product_id} = req.params
    const product = await pool.query("SELECT * FROM products WHERE product_id = $1", [product_id])
    res.json(product.rows)
  } catch (err) {
    console.error(err.message)
  }
})

app.listen(5000, () => {
  console.log("server has started on port 5000")
});