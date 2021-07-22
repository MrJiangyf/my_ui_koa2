/**
 * @description 个人主页
 */
const {getBlogListByUser} = require("../service/blog");
const {SuccessModel, ErrorModel} = require("../model/ResModel");

async function getProfileBlogList({userName, pageIndex = 0, pageSize}) {
    const result = await getBlogListByUser({
        userName,
        pageIndex,
        pageSize
    });

    return new SuccessModel({
        data: {
            blogList: result.blogList,
            isEmpty: result.blogList.length == 0,
            count: result.count
        },
        msg: "获取博客列表成功"
    })
}

module.exports = {
    getProfileBlogList
}
