/**
 * @description 博客
 */
const {Blog, User} = require("../db/model/index");
const {formatUser, formatBlog} = require("../utils/data_format");
/**
 * 创建博客
 */
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
/**
 * 编辑博客内容
 */
async function editBlogInfos({blogId, content, title, type, labels, auth}) {
    // 拼接要修改的用户信息
    let updateData = {};
    if(content) {
        updateData.content = content;
    }
    if(title) {
        updateData.title = title;
    }
    if(type) {
        updateData.type = type;
    }
    if(labels) {
        updateData.labels = labels;
    }
    if(auth) {
        updateData.auth = auth;
    }
    const result = await Blog.update(updateData, {
        where: {
            id: blogId
        }
    });
    let boolean = result[0] > 0;
    return boolean //修改行数
}

async function deleteBlogInfos(blogId) {
    const result = await Blog.destroy({
        where: {
            id: blogId
        }
    });
    // result:删除的行数
    return result > 0;
}
/**
 * 根据指定条件过滤文章
 */
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
    editBlogInfos,
    deleteBlogInfos,
    filterBlogList,
}
