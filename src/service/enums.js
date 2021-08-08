const { TypeEnums, LabelEnums } = require("../db/model/index");

// 获取分类专栏枚举
async function getTypeEnums() {
    let enumList = await TypeEnums.findAndCountAll({
        attributes: ["id", "code", "label"],
    });
    enumList =  enumList.rows.map(item => {
        return item.dataValues;
    });
    return enumList;
}
// 获取标签枚举
async function getLabelEnums() {
    let enumList = await LabelEnums.findAndCountAll({
        attributes: ["id", "code", "label"]
    });
    enumList =  enumList.rows.map(item => {
        return item.dataValues;
    });
    return enumList;
}

module.exports = {
    getLabelEnums,
    getTypeEnums
}
