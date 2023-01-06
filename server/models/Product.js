const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../db.js')
const Supplier = require('./Supplier')

class Product extends Model {}

Product.init({
  productId: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  supplierId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'suppliers',
      key: 'supplier_id'
    }
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

Product.belongsTo(Supplier, {
  foreignKey: 'supplierId',
  targetKey: 'supplierId',
  as: 'supplier'
})

module.exports = Product