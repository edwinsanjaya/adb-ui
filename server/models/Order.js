const {DataTypes, Model} = require('sequelize')
const {sequelize} = require('../db.js')
const Product = require('./Product')
const CancelOrder = require('./CancelOrder')

class Order extends Model {
}

Order.init({
    customerId: {
        type: DataTypes.TEXT,
        field: 'customer_id'
    },
    rgId: {
        type: DataTypes.INTEGER,
        field: 'rg_id',
        primaryKey: true
    },
    rmId: {
        type: DataTypes.TEXT,
        field: 'rm_id'
    },
    rsId: {
        type: DataTypes.TEXT,
        field: 'rs_id'
    },
    shippingId: {
        type: DataTypes.TEXT,
        field: 'shipping_id'
    },
    orderTime: {
        type: 'TIMESTAMP',
        field: 'order_time'
    },
    productId: {
        type: DataTypes.INTEGER,
        field: 'product_id'
    },
    latestShippingTime: {
        type: DataTypes.DATE,
        field: 'latest_shipping_time'
    },
    actualShippingTime: {
        type: 'TIMESTAMP',
        field: 'actual_shipping_time'
    },
    shippingAddress: {
        type: DataTypes.TEXT,
        field: 'shipping_address'
    },
    shippingZipcode: {
        type: DataTypes.INTEGER,
        field: 'shipping_zipcode'
    },
    deliveryCompany: {
        type: DataTypes.TEXT,
        field: 'delivery_company'
    },
    warehouseCompany: {
        type: DataTypes.TEXT,
        field: 'warehouse_company'
    },
    shippingWay: {
        type: DataTypes.TEXT,
        field: 'shipping_way'
    },
    redeliveryCount: {
        type: DataTypes.INTEGER,
        field: 'redelivery_count'
    },
    latitude: {
        type: DataTypes.NUMERIC
    },
    longitude: {
        type: DataTypes.NUMERIC
    },
    fileSource: {
        type: DataTypes.TEXT,
        field: 'file_source'
    }
}, {
    createdAt: false,
    updatedAt: false,
    underscored: true,
    sequelize
});

module.exports = Order