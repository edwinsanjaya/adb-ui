const express = require("express")
const app = express();
const cors = require("cors")
const { pool, sequelize } = require("./db")

const products = require("./routes/products")
const suppliers = require("./routes/suppliers")
const orders = require("./routes/orders")
const dashboard = require("./routes/dashboard")

const Product = require("./models/Product")
const Supplier = require("./models/Supplier")
const CancelOrder = require("./models/CancelOrder");
const Order = require("./models/Order")

Supplier.hasMany(Product, {
  foreignKey: 'supplierId',
  as: 'products'
})

Product.belongsTo(Supplier, {
  foreignKey: 'supplierId',
  targetKey: 'supplierId',
  as: 'supplier'
})

Order.belongsTo(Product, {
  foreignKey: 'productId',
  targetKey: 'productId',
  as: 'product'
});

Product.hasMany(Order, {
  foreignKey: 'productId',
  as: 'orders'
})

Order.hasOne(CancelOrder, {
  foreignKey: 'rgId',
  as: 'cancelOrder'
})

CancelOrder.belongsTo(Order, {
  foreignKey: 'rgId',
  targetKey: 'rgId'
})

// Middleware
app.use(cors());
app.use(express.json())

// Sequelize
sequelize.authenticate()
  .then(() => console.log('Sequelize: Connection has been established successfully'))
  .catch(err => console.log('Sequelize: Unable to connect to the database:', err))

// Routes
app.use(products)
app.use(suppliers)
app.use(orders)
app.use(dashboard)

app.post("/query", async (req, res) => {
  try {
    console.log(req.body.query)
    const query = req.body.query
    const results = await pool.query(query)
    res.json(results.rows)
  } catch (err) {
    console.error(err.message)
  }
})

app.get("/products", async (req, res) => {
  try {
    const products = await pool.query("SELECT * FROM products LIMIT 100")
    res.json(products.rows)
  } catch (err) {
    console.error(err.message)
  }
})

app.get("/product/:product_id", async (req, res) => {
  try {
    const { product_id } = req.params
    const product = await pool.query("SELECT * FROM products WHERE product_id = $1", [product_id])
    res.json(product.rows)
  } catch (err) {
    console.error(err.message)
  }
})

app.listen(5000, () => {
  console.log("server has started on port 5000")
});