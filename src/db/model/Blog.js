/**
 * @description 博客数据模型
 */

const seq = require("../seq");
const { INTEGER, STRING, TEXT } = require("../types");

const Blog = seq.define("blog", {
    userId: {
        type: INTEGER,
        allowNull: false,
        comment: "用户ID"
    },
    content: {
        type: TEXT,
        allowNull: false,
        comment: "博客内容"
    },
    image: {
        type: STRING,
        comment: "图片地址"
    },
    type: {
        type: STRING,
        allowNull: false,
        comment: "博客类型"
    },
    title: {
        type: STRING,
        allowNull: false,
        comment: "博客标题"
    }
});

module.exports = {
    Blog
}
