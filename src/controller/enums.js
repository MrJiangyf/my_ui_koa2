const { getLabelEnums, getTypeEnums } = require("../service/enums.js");
const { getEmusErrorInfo } = require("../model/ErrorInfos");
const { SuccessModel, ErrorModel } = require("../model/ResModel");

// 标签枚举
async function labelEnums() {
    const result = await getLabelEnums();
    if(result) {
        return new SuccessModel({
            data: result,
            msg: "获取标签枚举列表成功"
        });
    }else {
        return new ErrorModel(getEmusErrorInfo);
    }
}
// 分类栏枚举
async function typeEnums() {
    const result = await getTypeEnums();
    if(result) {
        return new SuccessModel({
            data: result,
            msg: "获取分类栏枚举列表成功"
        });
    }else {
        return new ErrorModel(getEmusErrorInfo);
    }
}

module.exports = {
    labelEnums,
    typeEnums
}
