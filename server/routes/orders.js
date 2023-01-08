const router = require("express").Router()
const Product = require("../models/Product");
const Order = require("../models/Order");
const Supplier = require("../models/Supplier");
const CancelOrder = require("../models/CancelOrder");
const { Op, Sequelize, or } = require('sequelize');
const { pool, sequelize } = require('../db.js')

router.get('/orders/supplier_id/:supplierId', async (req, res) => {
  try {
    const { supplierId } = req.params
    const orders = await pool.query(`SELECT orders.*
                                         FROM products
                                                  INNER JOIN orders
                                                             ON orders.product_id = products.product_id
                                         WHERE products.supplier_id = $1`, [supplierId])
    res.json(orders.rows)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: 'Internal Server Error' })
  }
})

router.post('/orders/filter/supplier_period_region', async (req, res) => {
  try {
    const body = req.body
    const supplierIdFilter = body.supplierId
    const startTimeFilter = body.startTime/1000
    const endTimeFilter = body.endTime/1000

    const orders = await pool.query(`SELECT orders.*
      FROM products
      INNER JOIN orders
      ON orders.product_id = products.product_id
      WHERE products.supplier_id = $1
      AND orders.order_time BETWEEN TO_TIMESTAMP($2)
      AND TO_TIMESTAMP($3)`, [supplierIdFilter, startTimeFilter, endTimeFilter])
    console.log(orders)
    res.json(orders.rows)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: 'Internal Server Error' })
  }
})

router.post('/orders/filter', async (req, res, next) => {
  try {
    const page = req.query.page;
    const size = req.query.size;
    const body = req.body;

    const rgIdFilter = body.rgId;
    const productFilter = body.product;
    const customerIdFilter = body.customerId;
    const supplierIdFilter = body.supplier;
    const periodFilter = body.period;
    const zipCodeFilter = body.zipCode;
    const countyFilter = body.county;
    const townFilter = body.town;
    const cancelledFilter = body.cancelled;
    const cancelReasonFilter = body.cancelReason;
    const sortedBy = body.sortedBy;
    const sortDirection = body.sortDirection;

    const orderFilters = [];
    if (rgIdFilter) {
      orderFilters.push({
        rgId: rgIdFilter
      })
    }
    if (periodFilter) {
      const periodFilterStartDate = new Date(periodFilter)
      periodFilterStartDate.setHours(0)
      periodFilterStartDate.setMinutes(0)
      periodFilterStartDate.setMilliseconds(0)

      const periodFilterEndDate = new Date(periodFilter)
      periodFilterEndDate.setHours(23)
      periodFilterEndDate.setMinutes(59)
      periodFilterEndDate.setMilliseconds(59)

      orderFilters.push({
        orderTime: {
          [Op.gte]: periodFilterStartDate,
          [Op.lte]: periodFilterEndDate
        }
      })
    }

    if (customerIdFilter) {
      orderFilters.push({
        customerId: customerIdFilter
      })
    }

    if (zipCodeFilter) {
      orderFilters.push({
        shippingZipcode: zipCodeFilter
      })
    }

    if (townFilter) {
      orderFilters.push(Sequelize.where(Sequelize.fn(`ST_Within`, Sequelize.col('shipping_geom'),
        Sequelize.literal(`(SELECT geom FROM taiwan_town WHERE towneng = '${townFilter}' AND countyid = (SELECT countyid FROM taiwan_county WHERE countyeng = '${countyFilter}'))`)), true))
    } else if (countyFilter) {
      orderFilters.push(Sequelize.where(Sequelize.fn(`ST_Within`, Sequelize.col('shipping_geom'),
        Sequelize.literal(`(SELECT geom FROM taiwan_county WHERE countyeng = '${countyFilter}')`)), true))
    }


    const productFilters = [];
    if (productFilter) {
      productOrFilter = []
      if (productFilter && !isNaN(productFilter)) {
        productOrFilter.push({
          productId: Number(productFilter)
        })
      }
      productOrFilter.push({
        productName: {
          [Op.like]: `%${productFilter}%`
        }
      })
      productFilters.push({
        [Op.or]: [...productOrFilter]
      })
    }

    const supplierFilter = [];
    if (supplierIdFilter && !isNaN(supplierIdFilter)) {
      supplierFilter.push({
        supplierId: supplierIdFilter
      })
    }

    const cancelOrderFilter = [];
    if (cancelReasonFilter) {
      cancelOrderFilter.push({
        cancelReason: cancelReasonFilter
      })
    }
    const orderBy = [];
    if (sortedBy && sortDirection) {
      orderBy.push(sortedBy)
      orderBy.push(sortDirection)
    }

    let queryOptions = {
      include: [],
      where: Sequelize.and(...orderFilters),
      limit: size,
      offset: (page - 1) * size,
      distinct: true
    };
    queryOptions.include.push({
      model: Product,
      as: 'product',
      required: productFilters.length > 0 || supplierFilter.length > 0,
      where: Sequelize.and(...productFilters),
      include: [{
        model: Supplier,
        as: 'supplier',
        required: supplierFilter.length > 0,
        where: Sequelize.and(...supplierFilter)
      }]
    })
    queryOptions.include.push({
      model: CancelOrder,
      as: 'cancelOrder',
      required: (cancelledFilter && !!cancelledFilter) || cancelOrderFilter?.length > 0,
      where: Sequelize.and(...cancelOrderFilter)
    })
    if (orderBy.length > 0) {
      queryOptions.order = [orderBy]
    }

    const orders = await Order.findAll(queryOptions)

    for (const order of orders) {
      const cancelOrder = await CancelOrder.findOne({
        where: {
          rgId: order.rgId
        }
      })
      order.cancelOrder = cancelOrder
    }

    delete queryOptions.limit;
    delete queryOptions.offset;
    delete queryOptions.order;
    queryOptions.distinct = false;
    const totalItems = await Order.count(queryOptions)
    const response = {
      content: orders,
      metadata: {
        page,
        size,
        totalItems
      }
    }
    res.send(response)
  } catch (e) {
    next(e)
  }
})

router.get('/orders/:order_id', async (req, res) => {
  try {
    const { order_id } = req.params
    const orders = await pool.query(`SELECT *
                                         FROM orders
                                         WHERE rg_id = $1`, [order_id])
    res.json(orders.rows)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: 'Internal Server Error' })
  }
})

module.exports = router;