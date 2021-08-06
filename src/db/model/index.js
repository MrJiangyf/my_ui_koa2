/**
 *  @description 数据模型入口文件
 */

const { User } = require("./User");
const { Blog } = require("./Blog");
const { LabelEnums, TypeEnums} = require("./Enums");


module.exports = {
    User,
    Blog,
    LabelEnums,
    TypeEnums
}
