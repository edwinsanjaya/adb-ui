const router = require("express").Router()
const Product = require("../models/Product");
const { Op } = require('sequelize');
const { sequelize } = require('../db.js')

router.get("/products/search", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const offset = limit * page
    const totalRows = await Product.count({
      where: {
        [Op.or]: [{
          productName: {
            [Op.like]: '%' + search + '%'
          }
        }, sequelize.where(sequelize.cast(sequelize.col('Product.product_id'), 'varchar'), { [Op.like]: '%' + search + '%' })]
      }
    });
    const totalPage = Math.ceil(totalRows / limit);
    const result = await Product.findAll({
      where: {
        [Op.or]: [{
          productName: {
            [Op.like]: '%' + search + '%'
          }
        }, sequelize.where(sequelize.cast(sequelize.col('Product.product_id'), 'varchar'), { [Op.like]: '%' + search + '%' })]
      },
      offset: offset,
      limit: limit,
      order: [
        ['productId', 'ASC']
      ]
    });
    let sort = req.query.sort || "productName";

    res.json({
      result: result,
      page: page,
      limit: limit,
      totalRows: totalRows,
      totalPage: totalPage
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: 'Internal Server Error' })
  }
})

module.exports = router;