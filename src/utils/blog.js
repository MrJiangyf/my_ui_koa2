/**
 * @description 微博数据相关工具方法
 */
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");

// 获取blog-list.ejs 文件内容
const BLOG_LIST_TPL = fs.readFileSync(
    path.join(__dirname, "..", "views", "widgets", "blog-list.ejs" )
).toString();

/**
 * 根据 blogList 渲染出 html 字符串
 * @param blogList 微博列表
 * @param canReply 是否可回复
 * @returns {*}
 */
function getBlogListStr(blogList = [], canReply = false) {
    return ejs.render(BLOG_LIST_TPL, {
        blogList,
        canReply
    })
}

module.exports = {
    getBlogListStr
}
