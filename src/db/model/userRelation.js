/**
 * @description 用户关系数据模型
 */

const seq = require("../seq");
const {STRING, INTEGER} = require("../types");

const UserRelation = seq.define("userRelation", {
    userId: {
        type: INTEGER,
        allowNull: false,
        comment: '用户 Id'
    },
    followerId: {
        type: INTEGER,
        allowNull: false,
        comment: '被当前用户 关注 的用户 Id'
    },

},);

module.exports = {
    UserRelation
};
