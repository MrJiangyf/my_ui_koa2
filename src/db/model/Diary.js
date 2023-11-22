/**
 * @description 日记数据模型
 */

const seq = require("../seq");
const { INTEGER, STRING, TEXT } = require("../types");

const Diary = seq.define("diary", {
    userId: {
        type: INTEGER,
        allowNull: false,
        comment: "用户ID"
    },
    title: {
        allowNull: false,
        type: TEXT,
        comment: "日记标题"
    },
    content: {
        allowNull: false,
        type: TEXT,
        comment: "日记内容"
    },
    auth: {
        type: STRING,
        comment: "日记权限"
    },
    lookNums: {
        allowNull: false,
        type: INTEGER,
        comment: "查看次数"
    },
    pictures: {
        type: TEXT,
        comment: "日记图片"
    },
    address: {
        type: STRING,
        comment: "日记发布地址"
    },
    lon: {
        type: INTEGER,
        comment: "日记经度"
    },
    lat: {
        type: INTEGER,
        comment: "地址维度"
    },
});

module.exports = {
    Diary
}
