const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../db.js')

class Supplier extends Model {}

Supplier.init({
  supplierId: {
    type: DataTypes.INTEGER
  },
  supplierName: {
    type: DataTypes.STRING
  },
  sourceZipcode: {
    type: DataTypes.INTEGER
  },
  sourceAddress: {
    type: DataTypes.STRING
  },
  sourceAddress1: {
    type: DataTypes.STRING
  },
  sourceLatitude: {
    type: DataTypes.DOUBLE
  },
  sourceLongitude: {
    type: DataTypes.DOUBLE
  },
  supplierZipcode: {
    type: DataTypes.INTEGER
  },
  supplierAddress: {
    type: DataTypes.STRING
  },
  supplierLatitude: {
    type: DataTypes.DOUBLE
  },
  supplierLongitude: {
    type: DataTypes.DOUBLE
  }
},{
  createdAt: false,
  updatedAt: false,
  underscored: true,
  sequelize
});

module.exports = Supplier