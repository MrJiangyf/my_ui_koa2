/**
 * @description 博客
 */
const {Blog, User} = require("../db/model/index");
const {formatUser, formatBlog} = require("../utils/data_format");

async function createBlog({userId, content, title, type, labels, auth}) {
     const result = await Blog.create({
         userId,
         content,
         title,
         type,
         labels,
         auth
     });
    return result.dataValues;
}

async function filterBlogList({blogId, type, userId, pageIndex = 0, pageSize = 10}) {
    // 拼接查询条件
    let query = {};
    let blogTributes = ["id", "userId", "title", "content", "type", "labels", "auth", "lookNums", "createdAt", "updatedAt"];
    if(userId) {
        query.userId = userId;
    }
    if(type) {
        query.type = type;
        blogTributes = ["id", "userId", "title", "type", "labels", "auth", "lookNums", "createdAt", "updatedAt"];
    }
    if(blogId) {
        query.id = parseInt(blogId);
    }
    // 根据传入条件查询博客列表
    let blogList = await Blog.findAndCountAll({
        limit: pageSize,
        offset: pageIndex,
        order: [["createdAt", "desc"]],
        where: query,
        attributes: blogTributes
    });
    blogList = blogList.rows.map(item => {
        return item.dataValues;
    });
    // 添加用户人员信息
    for(let i=0;i<blogList.length;i++) {
        let item = blogList[i];
        // 根据用户ID查询用户信息
        let userInfos = await User.findOne({
            where: {
                id: item.userId
            },
            attributes: ["userName", "nickName", "picture", "id", "gender"],
        });
        item.userInfos = userInfos.dataValues;
    }
    return {
        blogList,
        count: blogList.count || 0
    }
}

module.exports = {
    createBlog,
    filterBlogList,
}
