/**
 *  @description 数据模型入口文件
 */

const { User } = require("./User");
const { Article } = require("./Article");
const { Diary } = require("./Diary");
const { LabelEnums, TypeEnums} = require("./Enums");


module.exports = {
    User,
    Article,
    Diary,
    LabelEnums,
    TypeEnums
}
