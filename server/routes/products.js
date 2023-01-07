const router = require("express").Router()
const Product = require("../models/Product");
const {Op, Sequelize} = require('sequelize');
const {sequelize} = require('../db.js')

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
                }, sequelize.where(sequelize.cast(sequelize.col('Product.product_id'), 'varchar'), {[Op.like]: '%' + search + '%'})]
            }
        });
        const totalPage = Math.ceil(totalRows / limit);
        const result = await Product.findAll({
            where: {
                [Op.or]: [{
                    productName: {
                        [Op.like]: '%' + search + '%'
                    }
                }, sequelize.where(sequelize.cast(sequelize.col('Product.product_id'), 'varchar'), {[Op.like]: '%' + search + '%'})]
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
        res.status(500).json({error: true, message: 'Internal Server Error'})
    }
})

router.post("/products/filter", async (req, res) => {
    const body = req.body;
    const page = req.query.page;
    const size = req.query.size;

    const keywordFilter = body.keyword;
    const queryKeywords = [];
    const productQueryFilters = [];
    if (keywordFilter?.length > 0) {
        const queryOrKeywords = [];
        if (!isNaN(keywordFilter)) {
            queryOrKeywords.push({
                productId: keywordFilter
            }, {
                eanBarcode: keywordFilter
            })
        }
        queryOrKeywords.push({
            productName: {
                [Op.like]: `%${keywordFilter}%`
            }
        })
        queryKeywords.push({
            [Op.or]: [...queryOrKeywords]
        })
        productQueryFilters.push(queryKeywords)
    }
    const categoryFilter = body.category;
    if (!isNaN(categoryFilter)) {
        productQueryFilters.push({
            category: categoryFilter
        })
    }

    const warehouseCompanyFilter = body.warehouseCompany;
    if (warehouseCompanyFilter?.length > 0) {
        productQueryFilters.push({
            warehouseCompany: warehouseCompanyFilter
        })
    }

    const sortedBy = body.sortedBy;
    const sortDirection = body.sortDirection;
    const orders = [];
    if (sortedBy && sortDirection) {
        orders.push([sortedBy, sortDirection])
    }
    const queryOptions = {
        where: Sequelize.and(...productQueryFilters),
        limit: size,
        offset: page * size,
        order: orders
    }
    const products = await Product.findAll(queryOptions);
    delete queryOptions.limit;
    delete queryOptions.offset;
    delete queryOptions.order;
    const totalItems = await Product.count(queryOptions);
    const response = {
        content: products,
        metadata: {
            page, size, totalItems
        }
    }
    res.send(response)
})

module.exports = router;