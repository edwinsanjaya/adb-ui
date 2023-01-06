const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../db.js')

class Product extends Model {}

Product.init({
  productId: {
    type: DataTypes.INTEGER
  },
  supplierId: {
    type: DataTypes.INTEGER
  },
  productName: {
    type: DataTypes.STRING
  },
  category: {
    type: DataTypes.INTEGER
  },
  subcategory: {
    type: DataTypes.INTEGER
  },
  partName: {
    type: DataTypes.STRING
  },
  eanBarcode: {
    type: DataTypes.BIGINT
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
    type: DataTypes.INTEGER
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

Product.removeAttribute('id');

module.exports = Product