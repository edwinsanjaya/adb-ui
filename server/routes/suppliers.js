const router = require("express").Router()
const Supplier = require("../models/Supplier");
const TaiwanCountry = require("../models/TaiwanCountry");
const {Op, Sequelize} = require('sequelize');
const {pool, sequelize} = require('../db.js')

router.get('/suppliers/product_id/:product_id', async (req, res) => {
    try {
        const {product_id} = req.params
        const product = await pool.query("SELECT supplier_id, COUNT(*) total_products, (SELECT supplier_name FROM suppliers where suppliers.supplier_id = products.supplier_id) FROM products WHERE product_id = $1 AND supplier_id in (SELECT DISTINCT supplier_id FROM suppliers) GROUP BY supplier_id ORDER BY total_products DESC", [product_id])
        res.json(product.rows)
    } catch (error) {
        console.log(error);
        res.status(500).json({error: true, message: 'Internal Server Error'})
    }
})

router.get('/supplier/:supplier_id', async (req, res) => {
  try {
      const {supplier_id} = req.params
      const supplier = await pool.query("SELECT * from suppliers where supplier_id = $1", [supplier_id])
      res.json(supplier.rows)
  } catch (error) {
      console.log(error);
      res.status(500).json({error: true, message: 'Internal Server Error'})
  }
})

router.post('/suppliers/filter', async (req, res) => {
    const page = req.query.page;
    const size = req.query.size;
    const body = req.body;
    const filter = []
    const taiwanCountryFilter = body.taiwanCountry;
    if (taiwanCountryFilter) {
        filter.push(Sequelize.where(Sequelize.fn(`ST_Within`, Sequelize.col('supplier_geom'),
            Sequelize.literal(`(SELECT geom FROM taiwan_county WHERE countyeng = '${taiwanCountryFilter}')`)), true))
    }
    const nameFilter = body.name;
    if (nameFilter) {
        const queryOrNameFilter = [];
        if (!isNaN(nameFilter)) {
            queryOrNameFilter.push({
                supplierId: nameFilter
            })
        }
        queryOrNameFilter.push({
            supplierName: {
                [Op.like]: `%${nameFilter}%`
            }
        })
        filter.push({
            [Op.or]: [...queryOrNameFilter]
        })
    }
    const addressFilter = body.address;
    if (addressFilter) {
        filter.push({
            supplierAddress: {
                [Op.like]: `%${addressFilter}%`
            }
        })
    }

    suppliers = await Supplier.findAll({
        where: Sequelize.and(...filter),
        limit: size,
        offset: (page - 1) * size
    })

    totalCount = await Supplier.count({
        where: Sequelize.and(...filter)
    })
    for (let supplier of suppliers) {
        const [orderCountResult, orderCountMetadata] = await sequelize.query(`select count(*)
                                                           from products p
                                                                    inner join orders o on p.product_id = o.product_id
                                                           where p.supplier_id = '${supplier.dataValues.supplierId}'`)
        const totalOrderCount = orderCountResult[0].count
        supplier.dataValues.totalOrderCount = Number(totalOrderCount)

        const [productCountResult, productCountMetadata] = await sequelize.query(`select count(*)
                                                           from products p
                                                           where p.supplier_id = '${supplier.dataValues.supplierId}'`)
        const totalProductCount = productCountResult[0].count
        supplier.dataValues.totalProductCount = Number(totalProductCount)
    }
    const response = {
        content: suppliers,
        metadata: {
            page,
            size,
            totalItems: totalCount
        }
    }
    res.send(response)
})

module.exports = router;