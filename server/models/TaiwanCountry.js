const {DataTypes, Model} = require('sequelize')
const {sequelize} = require('../db.js')

class TaiwanCountry extends Model {
}

TaiwanCountry.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    geom: {
        type: DataTypes.GEOMETRY
    },
    objectid: {
        type: DataTypes.STRING
    },
    countyid: {
        type: DataTypes.STRING
    },
    countycode: {
        type: DataTypes.STRING
    },
    countyeng: {
        type: DataTypes.STRING
    },
    countyname: {
        type: DataTypes.STRING
    },
    source: {
        type: DataTypes.STRING
    },
    shapeLeng: {
        type: DataTypes.DOUBLE
    },
    shapeArea: {
        type: DataTypes.DOUBLE
    }
}, {
    createdAt: false,
    updatedAt: false,
    underscored: true,
    sequelize
});

module.exports = TaiwanCountry