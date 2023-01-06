const {DataTypes, Model} = require('sequelize')
const {sequelize} = require('../db.js')
const Order = require('./Order')

class CancelOrder extends Model {
}

CancelOrder.init({
    rgId: {
        type: DataTypes.INTEGER
    },
    cancelTime: {
        type: DataTypes.STRING
    },
    procStatus: {
        type: DataTypes.INTEGER
    },
    cancelReason: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'cancel_order',
    createdAt: false,
    updatedAt: false,
    underscored: true,
    sequelize
});

CancelOrder.removeAttribute('id');

module.exports = CancelOrder