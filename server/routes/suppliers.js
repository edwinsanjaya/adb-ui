const router = require("express").Router()
const Supplier = require("../models/Supplier");
const TaiwanCountry = require("../models/TaiwanCountry");
const Product = require("../models/Product");
const Order = require("../models/Order");
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
    const taiwanTownFilter = body.taiwanTown;
    if (taiwanTownFilter) {
        filter.push(Sequelize.where(Sequelize.fn(`ST_Within`, Sequelize.col('supplier_geom'),
            Sequelize.literal(`(SELECT geom FROM taiwan_town WHERE towneng = '${taiwanTownFilter}')`)), true))
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
    const orderPeriodFilter = body.orderPeriod;
    const joinOrderFilters = [];
    if (orderPeriodFilter) {
        const startPeriod = new Date(orderPeriodFilter)
        startPeriod.setHours(0)
        startPeriod.setMinutes(0)
        startPeriod.setSeconds(0)
        startPeriod.setMilliseconds(0)

        const endPeriod = new Date(orderPeriodFilter)
        endPeriod.setHours(23)
        endPeriod.setMinutes(59)
        endPeriod.setSeconds(59)
        endPeriod.setMilliseconds(59)

        joinOrderFilters.push({
            orderTime: {
                [Op.gte]: startPeriod,
                [Op.lte]: endPeriod
            }
        })
    }

    const zipCodeFilter = body.zipCode;
    if (zipCodeFilter) {
        filter.push({
            supplierZipcode: zipCodeFilter
        })
    }

    const fileSourceFilter = body.fileSource;
    const joinProductFilters = [];
    if (fileSourceFilter) {
        joinProductFilters.push({
            fileSource: fileSourceFilter
        });
    }

    let findOptions = {
        where: Sequelize.and(...filter),
        limit: size,
        offset: (page - 1) * size
    };

    if (joinProductFilters.length > 0 || joinOrderFilters.length > 0) {
        findOptions.include = [{
            model: Product,
            as: 'products',
            required: joinProductFilters.length > 0,
            where: Sequelize.and(...joinProductFilters),
            include: [{
                model: Order,
                as: 'orders',
                required: joinOrderFilters.length > 0,
                where: Sequelize.and(...joinOrderFilters)
            }]
        }]
    }

    const sortedBy = body.sortedBy;
    const sortDirection = body.sortDirection;
    if (sortedBy && sortDirection) {
        findOptions.order = [
            [sortedBy, sortDirection]
        ]
    }

    const suppliers = await Supplier.findAll(findOptions)

    delete findOptions.limit
    delete findOptions.offset
    const totalCount = await Supplier.count(findOptions)
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