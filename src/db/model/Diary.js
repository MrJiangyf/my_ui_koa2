/**
 * @description 日记数据模型
 */

const seq = require("../seq");
const { INTEGER, STRING, TEXT, ARRAYSTRING } = require("../types");

const Article = seq.define("blog", {
    userId: {
        type: INTEGER,
        allowNull: false,
        comment: "用户ID"
    },
    title: {
        type: TEXT,
        allowNull: false,
        comment: "日记标题"
    },
    content: {
        type: TEXT,
        comment: "日记内容"
    },
    auth: {
        type: STRING,
        allowNull: false,
        comment: "日记权限"
    },
    lookNums: {
        type: INTEGER,
        comment: "查看次数"
    },
    pictures: {
        type: ARRAYSTRING,
        comment: "日记图片"
    },
    address: {
        type: STRING,
        allowNull: false,
        comment: "日记发布地址"
    },
    lon: {
        type: INTEGER,
        allowNull: false,
        comment: "日记经度"
    },
    lat: {
        type: INTEGER,
        allowNull: false,
        comment: "地址维度"
    },
});

module.exports = {
    Article
}
