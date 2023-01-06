const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../db.js')

class Order extends Model {}

Order.init({
  customerId: {
    type: DataTypes.STRING
  },
  rgId: {
    type: DataTypes.INTEGER
  },
  rmId: {
    type: DataTypes.STRING
  },
  rsId: {
    type: DataTypes.STRING
  },
  shippingId: {
    type: DataTypes.STRING
  },
  orderTime: {
    type: DataTypes.DATE
  },
  productId: {
    type: DataTypes.INTEGER
  },
  latestShippingTime: {
    type: DataTypes.DATE
  },
  actualShippingTime: {
    type: DataTypes.DATE
  },
  shippingAddress: {
    type: DataTypes.STRING
  },
  shippingZipCode: {
    type: DataTypes.INTEGER
  },
  deliveryCompany: {
    type: DataTypes.STRING
  },
  warehouseCompany: {
    type: DataTypes.STRING
  },
  shippingWay: {
    type: DataTypes.STRING
  },
  redeliveryCount:{
    type: DataTypes.INTEGER
  },
  latitude: {
    type: DataTypes.DOUBLE
  },
  longitude: {
    type: DataTypes.DOUBLE
  },
  fileSource: {
    type: DataTypes.STRING
  },
},{
  updatedAt: false,
  createdAt: false,
  underscored: true,
  sequelize
});

module.exports = Order