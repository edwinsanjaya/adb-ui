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
        filter.push({
            supplierName: {
                [Op.like]: `%${nameFilter}%`
            }
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