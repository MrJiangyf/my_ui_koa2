/**
 * @description 博客
 */
const {Blog, User} = require("../db/model/index");
const {formatUser, formatBlog} = require("../utils/data_format");

async function createBlog({content, image, userId, title, type}) {
     const result = await Blog.create({
         userId,
         content,
         image,
         type,
         title
     });
    return result.dataValues;
}

async function getBlogListByUser({userName, pageIndex = 0, pageSize = 10}) {
    // 拼接查询条件
    let query = {};
    if(userName) {
        query.userName = userName;
    }
    // 根据用户名查询用户信息
    let userInfos = await User.findOne({
        where: query,
        attributes: ["userName", "nickName", "picture", "id"],
    });
    // 根据用户id查询博客列表
    let blogList = await Blog.findAndCountAll({
        limit: pageSize,
        offset: pageIndex,
        order: [["id", "desc"]],
        where: {
            userId: userInfos.dataValues.id
        }
    });
    //获取博客列表
    blogList = blogList.rows.map(item => {
        return item.dataValues;
    });
    //格式化博客列表数据：时间，内容
    blogList = formatBlog(blogList);
    //格式化人员信息：默认头像
    blogList = blogList.map(item => {
        item.user = formatUser(userInfos.dataValues);
        return item;
    });
    return {
        blogList,
        count: blogList.count
    }
}

module.exports = {
    createBlog,
    getBlogListByUser,
}
