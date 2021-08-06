/**
 * @description 用户数据模型
 */

const seq = require("../seq");
const {STRING, DECIMAL} = require("../types");

const User = seq.define("user", {
    userName: {
        type: STRING,
        allowNull: false,
        unique: true,
        comment: '用户名，唯一'
    },
    password: {
        type: STRING,
        allowNull: false,
        comment: "密码"
    },
    userType: {
        type: STRING,
        allowNull: false,
        comment: '用户身份'
    },
    gender: {
        type: STRING,
        allowNull: false,
        defaultValue: "01",
        comment: "性别：男（01），女（02），保密（03）"
    },
    nickName: {
        type: STRING,
        allowNull: false,
        comment: '昵称，唯一'
    },
    picture: {
        type: STRING,
        comment: "头像， 图片地址"
    },
},);

module.exports = {
    User
};
