/**
 *  @description 数据模型入口文件
 */

const { User } = require("./User");
const { Blog } = require("./Article");
const { Diary } = require("./Diary");
const { LabelEnums, TypeEnums} = require("./Enums");


module.exports = {
    User,
    Blog,
    Diary,
    LabelEnums,
    TypeEnums
}
