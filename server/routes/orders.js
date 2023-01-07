const router = require("express").Router()
const Product = require("../models/Product");
const Order = require("../models/Order");
const Supplier = require("../models/Supplier");
const CancelOrder = require("../models/CancelOrder");
const {Op, Sequelize, or} = require('sequelize');
const {sequelize} = require('../db.js')

router.post('/orders/filter', async (req, res) => {
    // let temp ={
    //     "content": [
    //         {
    //             "customerId": ".O.kNX3isXn9ZAySWpvJLysYZg--",
    //             "rgId": 17934097,
    //             "rmId": "RM1102030002275",
    //             "rsId": "RS1102030003137",
    //             "shippingId": "4.15E+13",
    //             "orderTime": "2011-02-02T18:52:00.000Z",
    //             "productId": 4837302,
    //             "latestShippingTime": "2011-02-03T15:00:00.000Z",
    //             "actualShippingTime": "2011-02-03T09:33:00.000Z",
    //             "shippingAddress": "新竹市新竹市經國路一段275號",
    //             "shippingZipcode": 300,
    //             "deliveryCompany": "郵局包裹(7)",
    //             "warehouseCompany": "新豐",
    //             "shippingWay": "倉出",
    //             "redeliveryCount": 1,
    //             "latitude": "24.8014026",
    //             "longitude": "120.971678",
    //             "fileSource": "2011Q1",
    //             "product": {
    //                 "productId": 4837302,
    //                 "supplierId": 6821,
    //                 "productName": "【MiMi paradise】秋冬必備百搭素面棉質內搭褲-黑",
    //                 "category": 48788,
    //                 "subcategory": 1327,
    //                 "partName": null,
    //                 "eanBarcode": null,
    //                 "length": 35,
    //                 "width": 25,
    //                 "height": 6,
    //                 "weight": 1,
    //                 "createdAt": null,
    //                 "fileSource": "(商品主檔)sku_20120413",
    //                 "supplier": {
    //                     "supplierId": 6821,
    //                     "supplierName": "曜盛整合行銷有限公司",
    //                     "sourceAddress": "新北市泰山區泰林路2段218號",
    //                     "sourceZipcode": 243,
    //                     "sourceLatitude": "25.0618126",
    //                     "sourceLongitude": "121.4325059",
    //                     "supplierAddress": "新北市泰山區中正東路二段105巷1-2號8樓",
    //                     "supplierZipcode": "251",
    //                     "supplierLatitude": "25.151711",
    //                     "supplierLongitude": "121.459909"
    //                 }
    //             },
    //             "cancelOrder": {
    //                 "rgId": null,
    //                 "cancelTime": null,
    //                 "procStatus": null,
    //                 "cancelReason": null
    //             }
    //         }
    //     ],
    //     "metadata": {
    //         "page": "1",
    //         "size": "1",
    //         "totalItems": 9
    //     }
    // }
    // res.send(temp)
    // return
    // TODO remove debug

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

    if (!isNaN(customerIdFilter)) {
        orderFilters.push({
            customerId: customerIdFilter
        })
    }

    if (zipCodeFilter) {
        orderFilters.push({
            shippingZipcode: zipCodeFilter
        })
    }

    if (countyFilter) {
        orderFilters.push(Sequelize.where(Sequelize.fn(`ST_Within`, Sequelize.col('shipping_geom'),
            Sequelize.literal(`(SELECT geom FROM taiwan_county WHERE countyeng = '${countyFilter}')`)), true))
    }

    if (townFilter) {
        orderFilters.push(Sequelize.where(Sequelize.fn(`ST_Within`, Sequelize.col('shipping_geom'),
            Sequelize.literal(`(SELECT geom FROM taiwan_town WHERE towneng = '${countyFilter}')`)), true))
    }

    const productFilters = [];
    if (productFilter) {
        productOrFilter = []
        if (!isNaN(productFilter)) {
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
    if (!isNaN(supplierIdFilter)) {
        supplierFilter.push({
            supplierId: supplierIdFilter
        })
    }

    const cancelOrderFilter = [];
    if (cancelReasonFilter) {
        cancelOrderFilter.push({
            cancelReason: cancelOrderFilter
        })
    }

    let queryOptions = {
        include: [{
            model: Product,
            as: 'product',
            required: productFilters.length > 0,
            where: Sequelize.and(...productFilters),
            include: [{
                model: Supplier,
                as: 'supplier',
                required: supplierFilter.length > 0,
                where: Sequelize.and(...supplierFilter)
            }]
        }, {
            model: CancelOrder,
            as: 'cancelOrder',
            required: !!cancelledFilter || cancelOrderFilter.length > 0,
            where: Sequelize.and(...cancelOrderFilter)
        }],
        where: Sequelize.and(...orderFilters),
        limit: size,
        offset: page * size
    };
    const orders = await Order.findAll(queryOptions)

    delete queryOptions.limit;
    delete queryOptions.offset;
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
})

module.exports = router;