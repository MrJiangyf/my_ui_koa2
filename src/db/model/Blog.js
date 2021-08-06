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
    title: {
        type: TEXT,
        allowNull: false,
        comment: "博客标题"
    },
    path: {
        type: STRING,
        comment: "博客存放地址"
    },
    type: {
        type: STRING,
        allowNull: false,
        comment: "博客类型"
    },
    typeName: {
        type: STRING,
        allowNull: false,
        comment: "博客类型名称"
    },
    labels: {
        type: STRING,
        allowNull: false,
        comment: "博客标签"
    },
    labelNames: {
        type: STRING,
        allowNull: false,
        comment: "博客标题标签名称"
    },
    auth: {
        type: STRING,
        allowNull: false,
        comment: "博客权限"
    },
    lookNums: {
        type: INTEGER,
        allowNull: false,
        comment: "查看次数"
    }
});

module.exports = {
    Blog
}
