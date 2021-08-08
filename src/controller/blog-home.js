/**
 * @description 首页
 */
const { createBlog } = require("../service/blog");
const { SuccessModel, ErrorModel } = require("../model/ResModel");
const xss = require("xss");
const { createBlogFailInfo, getBlogFailInfo } = require("../model/ErrorInfos");
const {filterBlogList} = require("../service/blog");
const { getTypeEnums } = require("../service/enums.js");
/**
 * 创建博客
 * @param content
 * @param image
 * @param userId
 * @returns {Promise<void>}
 */
async function create({userId, content, title, type, labels, auth}) {
         try {
             // 创建博客
             const blog = await createBlog({
                 content: xss(content),
                 userId,
                 title,
                 type,
                 labels,
                 auth
             });
             return new SuccessModel({
                 data: blog,
                 msg: "创建成功"
             });
         }catch (e) {
             console.error(e.message, e.stack);
             return new ErrorModel(createBlogFailInfo);
         }
}

async function getBlogList({blogId, userId, type, pageIndex = 1, pageSize = 10}) {
    const result = await filterBlogList({
        blogId,
        userId,
        type,
        pageIndex,
        pageSize,
    });
    if(result) {
        return new SuccessModel({
            data: {
                blogList: result.blogList,
                isEmpty: result.blogList.length == 0,
                count: result.count || 0
            },
            msg: "获取博客列表成功"
        });
    }else {
        return new ErrorModel(getBlogFailInfo);
    }
}
async function getBlogMenuList({ctx, userId, pageIndex = 1, pageSize = 10}) {
    const typeEnums = await getTypeEnums();
    let lastResult = [];
    let curUserId = ctx.session.userInfo.id; // 当前用户ID
    for (let i=0;i<typeEnums.length;i++) {
        let item = typeEnums[i], type = item.code;
        let result = await filterBlogList({
            pageIndex: pageIndex || 0,
            pageSize: pageSize || 10000,
            userId,
            type
        });
        if(result) {
            let blogList = result.blogList, lastBlogList = [];
            blogList.map(blog => {
                blog.label = blog.title;
                // 只有个权限是“open”或者博客是本人的才能放到菜单中
                if(blog.auth == 'open' || blog.userId == curUserId) {
                    lastBlogList.push(blog);
                }
            });
            item.children = lastBlogList;
            if(lastBlogList && lastBlogList.length > 0) {
                lastResult.push(item);
            }
        }else {
            return new ErrorModel(getBlogFailInfo);
        }
    }
    return new SuccessModel({
        data: lastResult,
        msg: "获取博客列表成功"
    });
}

module.exports = {
    create,
    getBlogList,
    getBlogMenuList
};
