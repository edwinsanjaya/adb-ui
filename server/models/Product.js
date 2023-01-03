const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../db.js')

class Product extends Model {}

Product.init({
  supplierId: {
    type: DataTypes.INTEGER
  },
  productId: {
    type: DataTypes.INTEGER
  },
  productName: {
    type: DataTypes.STRING
  },
  category: {
    type: DataTypes.INTEGER
  },
  subcategory: {
    type: DataTypes.BIGINT
  },
  partNumber: {
    type: DataTypes.STRING
  },
  eanBarcode: {
    type: DataTypes.STRING
  },
  length: {
    type: DataTypes.DOUBLE
  },
  width: {
    type: DataTypes.DOUBLE
  },
  height: {
    type: DataTypes.DOUBLE
  },
  weight: {
    type: DataTypes.DOUBLE
  },
  warehouseCompany: {
    type: DataTypes.STRING
  },
  createdAt: {
    type: DataTypes.DATE
  },
  fileSource: {
    type: DataTypes.STRING
  }
},{
  updatedAt: false,
  underscored: true,
  sequelize
});

module.exports = Product