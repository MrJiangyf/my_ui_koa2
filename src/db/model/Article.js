/**
 * @description 博客文章数据模型
 */

const seq = require("../seq");
const { INTEGER, STRING, TEXT } = require("../types");

const Article = seq.define("blog", {
    userId: {
        type: INTEGER,
        allowNull: false,
        comment: "用户ID"
    },
    title: {
        type: TEXT,
        allowNull: false,
        comment: "博客标题"
    },
    content: {
        type: TEXT,
        comment: "博客内容"
    },
    type: {
        type: STRING,
        allowNull: false,
        comment: "博客分类栏"
    },
    labels: {
        type: STRING,
        comment: "博客标签"
    },
    auth: {
        type: STRING,
        allowNull: false,
        comment: "博客权限"
    },
    lookNums: {
        type: INTEGER,
        comment: "查看次数"
    }
});

module.exports = {
    Article
}
