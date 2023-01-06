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
  sourceAddress: {
    type: DataTypes.STRING
  },
  sourceZipcode: {
    type: DataTypes.INTEGER
  },
  sourceLatitude: {
    type: DataTypes.DOUBLE
  },
  sourceLongitude: {
    type: DataTypes.DOUBLE
  },
  supplierAddress: {
    type: DataTypes.STRING
  },
  supplierZipcode: {
    type: DataTypes.INTEGER
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