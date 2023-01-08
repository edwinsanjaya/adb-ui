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

        let product_ids = product_id.split(',').map(x => parseInt(x))
        // Calon" SQL Injection XD
        const product = await pool.query("SELECT supplier_id, COUNT(*) total_products, (SELECT supplier_name FROM suppliers where suppliers.supplier_id = products.supplier_id) FROM products WHERE product_id IN (" + product_id + ") AND supplier_id in (SELECT DISTINCT supplier_id FROM suppliers) GROUP BY supplier_id ORDER BY total_products DESC")
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

router.post("/suppliers/filter/region-order-period", async (req, res, next) => {
    try {
        const startPeriod = new Date(req.body.startPeriod).toISOString()
        const endPeriod = new Date(req.body.endPeriod).toISOString()
        const county = req.body.county
        const town = req.body.town
        let query = `SELECT s.*, COUNT(o.rg_id) as total_orders
                                                    FROM suppliers s
                                                             JOIN products p ON s.supplier_id = p.supplier_id
                                                             JOIN orders o ON p.product_id = o.product_id
                                                    WHERE o.order_time >= '${startPeriod}'
                                                      AND o.order_time <= '${endPeriod}' `
        let additionalQuery = ''
        if (town?.length > 0) {
            additionalQuery += `AND ST_Within(s.supplier_geom, (SELECT geom FROM taiwan_town WHERE towneng = '${town}' AND countyid = (SELECT countyid FROM taiwan_county WHERE countyeng = '${county}') LIMIT 1))`
        } else if (county?.length > 0) {
            additionalQuery += `AND ST_Within(s.supplier_geom, (SELECT geom FROM taiwan_county WHERE countyeng = '${county}' LIMIT 1))`
        }
        query += ` ${additionalQuery} GROUP BY s.supplier_id ORDER BY total_orders DESC`
        const [result, metadata] = await sequelize.query(query)
        console.log(result)
        res.send(result)
    } catch (e) {
        next(e)
    }
})

router.post('/suppliers/filter', async (req, res, next) => {
    try {
        const page = req.query.page;
        const size = req.query.size;
        const body = req.body;
        const filter = []
        const taiwanCountryFilter = body.taiwanCountry;
        const taiwanTownFilter = body.taiwanTown;
        let conditionQuery = [];
        if (taiwanTownFilter && taiwanCountryFilter) {
            conditionQuery.push(`ST_Within(s.supplier_geom, (SELECT geom FROM taiwan_town WHERE towneng = '${taiwanTownFilter}' AND countyid = (SELECT countyid FROM taiwan_county WHERE countyeng = '${taiwanCountryFilter}') LIMIT 1))`)
        } else if (taiwanCountryFilter) {
            conditionQuery.push(`ST_Within(s.supplier_geom, (SELECT geom FROM taiwan_county WHERE countyeng = '${taiwanCountryFilter}' LIMIT 1))`)
        }
        const nameFilter = body.name;
        if (nameFilter) {
            if (!isNaN(nameFilter)) {
                conditionQuery.push(`(s.supplier_id = ${nameFilter} OR s.supplier_name LIKE '%${nameFilter}%')`)
            } else {
                conditionQuery.push(`s.supplier_name LIKE '%${nameFilter}%'`)
            }
        }
        const orderPeriodFilter = body.orderPeriod;
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

            conditionQuery.push(`o.order_time >= '${startPeriod}' AND o.order_time <= '${endPeriod}'`)
        }

        const zipCodeFilter = body.zipCode;
        if (zipCodeFilter) {
            filter.push({
                supplierZipcode: zipCodeFilter
            })
            conditionQuery.push(`s.supplier_zipcode = '${zipCodeFilter}'`)
        }

        const fileSourceFilter = body.fileSource;
        if (fileSourceFilter) {
            conditionQuery.push(`p.file_source = '${fileSourceFilter}'`)
        }

        let conditionRawQuery = ''
        if (conditionQuery.length > 0) {
            conditionRawQuery += 'WHERE '
            for (const condition of conditionQuery) {
                conditionRawQuery += ` ${condition}`
                conditionRawQuery += ' AND'
            }
            conditionRawQuery = conditionRawQuery.replace(/ AND$/, '')
        }

        let orderByQuery = '';
        if (!!body.sortedBy && !!body.sortDirection) {
            orderByQuery += `ORDER BY ${body.sortedBy} ${body.sortDirection}`
        }
        let limitOffsetQuery = ` LIMIT ${size} OFFSET ${(page - 1) * size}`;

        let query = `SELECT s.*, COUNT(o.rg_id) as total_orders, COUNT(p.product_id) as total_products
                     FROM suppliers s
                              JOIN products p ON s.supplier_id = p.supplier_id
                              JOIN orders o ON p.product_id = o.product_id ${conditionRawQuery} 
                     GROUP BY s.supplier_id ${orderByQuery} ${limitOffsetQuery}`

        const [suppliers, metadata] = await sequelize.query(query)

        let countQuery = `SELECT COUNT(*) as total_rows
                          FROM (SELECT s.*, COUNT(o.rg_id) as total_orders, COUNT(p.product_id) as total_products
                                FROM suppliers s
                                         JOIN products p ON s.supplier_id = p.supplier_id
                                         JOIN orders o ON p.product_id = o.product_id ${conditionRawQuery} 
                                GROUP BY s.supplier_id) as t`
        const [countResult, countResultMetadata] = await sequelize.query(countQuery)
        const response = {
            content: suppliers,
            metadata: {
                page,
                size,
                totalItems: Number(countResult[0]['total_rows'])
            }
        }
        res.send(response)
    } catch (e) {
        next(e)
    }
})

module.exports = router;