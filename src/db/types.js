/**
 *@description 封装 Sequelize 数据类型
 */

const { Sequelize, DataTypes } = require('sequelize');
module.exports = {
    STRING: Sequelize.STRING,
    DECIMAL: Sequelize.DECIMAL,
    TEXT: Sequelize.TEXT,
    INTEGER: Sequelize.INTEGER,
    BOOLEAN: Sequelize.BOOLEAN,
    ARRAYSTRING: DataTypes.ARRAY(DataTypes.STRING),
}
