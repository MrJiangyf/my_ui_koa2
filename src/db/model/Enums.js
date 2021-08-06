/**
 * @description 枚举表
 */

const seq = require("../seq");
const { STRING, TEXT } = require("../types");
// 标签枚举
const LabelEnums = seq.define("labelEnums", {
    code: {
        type: STRING,
        allowNull: false,
        comment: "枚举值"
    },
    label: {
        type: TEXT,
        allowNull: false,
        comment: "枚举名"
    },
});
// 分类专栏枚举
const TypeEnums = seq.define("typeEnums", {
    code: {
        type: STRING,
        allowNull: false,
        comment: "枚举值"
    },
    label: {
        type: TEXT,
        allowNull: false,
        comment: "枚举名"
    },
});

module.exports = {
    LabelEnums,
    TypeEnums
};
