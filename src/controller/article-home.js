/**
 * @description 首页
 */
const { createBlog, editBlogInfos, deleteBlogInfos, updateBlogRecoord } = require("../service/article.js");
const { SuccessModel, ErrorModel } = require("../model/ResModel.js");
const xss = require("xss");
const { createBlogFailInfo, getBlogFailInfo, editBlogFailInfo } = require("../model/ErrorInfos.js");
const { filterBlogList } = require("../service/article.js");
const { getTypeEnums } = require("../service/enums.js");
/**
 * 创建博客
 */
async function create({ userId, content, title, type, labels, auth }) {
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
    } catch (e) {
        return new ErrorModel(createBlogFailInfo);
    }
}
/**
 * 编辑博客
 */
async function editBlog({ blogId, content, title, type, labels, auth }) {
    try {
        // 编辑博客
        const result = await editBlogInfos({
            content: xss(content),
            blogId,
            title,
            type,
            labels,
            auth
        });
        if (result) {
            return new SuccessModel({
                data: result,
                msg: "成功编辑文章!"
            });
        } else {
            return new ErrorModel(editBlogFailInfo);
        }
    } catch (e) {
        return new ErrorModel(editBlogFailInfo);
    }
}
/**
 * 查看博客记录
 */
async function updateLookRecoord(blogId) {
    const result = await updateBlogRecoord(blogId);
    if (result) {
        return new SuccessModel({
            data: "",
            msg: '更新成功',
        })

        return new ErrorModel({
            data: "",
            msg: "更新失败"
        })
    }
}
/**
 * 删除文章
 */
async function deleteBlog(blogId) {
    const result = await deleteBlogInfos(blogId);
    if (result) {
        return new SuccessModel({
            data: "",
            msg: '删除成功',
        })

        return new ErrorModel({
            data: "",
            msg: "删除失败"
        })
    }
}

/**
 * 获取博客列表
 */
async function getBlogList({ blogId, userId, type, pageIndex = 1, pageSize = 10 }) {
    const result = await filterBlogList({
        blogId,
        userId,
        type,
        pageIndex,
        pageSize,
    });
    if (result) {
        return new SuccessModel({
            data: {
                blogList: result.blogList,
                isEmpty: result.blogList.length == 0,
                count: result.count || 0
            },
            msg: "获取博客列表成功"
        });
    } else {
        return new ErrorModel(getBlogFailInfo);
    }
}
/**
 * 获取菜单列表
 */
async function getBlogMenuList({ ctx, userId, pageIndex = 1, pageSize = 10 }) {
    const typeEnums = await getTypeEnums();
    let lastResult = [];
    let curUserId = ctx.session.userInfo.id; // 当前用户ID
    for (let i = 0; i < typeEnums.length; i++) {
        let item = typeEnums[i], type = item.code;
        let result = await filterBlogList({
            pageIndex: pageIndex || 0,
            pageSize: pageSize || 10000,
            userId,
            type
        });
        if (result) {
            let blogList = result.blogList, lastBlogList = [];
            blogList.map(blog => {
                blog.label = blog.title;
                // 只有个权限是“open”或者博客是本人的才能放到菜单中
                if (blog.auth == 'open' || blog.userId == curUserId) {
                    lastBlogList.push(blog);
                }
            });
            item.children = lastBlogList;
            if (lastBlogList && lastBlogList.length > 0) {
                lastResult.push(item);
            }
        } else {
            return new ErrorModel(getBlogFailInfo);
        }
    }
    return new SuccessModel({
        data: lastResult,
        msg: "获取博客列表成功"
    });
}

/**
 * 根据菜单code获取菜单列表数据
 * */
async function getMenuByCode({ ctx, code, userId, pageIndex = 1, pageSize = 10 }) {
    let curUserId = ctx.session?.userInfo ? ctx.session?.userInfo?.id : ''; // 当前用户ID
    let result = await filterBlogList({
        pageIndex: pageIndex || 0,
        pageSize: pageSize || 10000,
        userId,
        type: code
    });
    const lastBlogList = [];
    if (result) {
        const blogList = result.blogList;
        blogList.map(blog => {
            blog.label = blog.title;
            // 只有个权限是“open”或者博客是本人的才能放到菜单中
            if (blog.auth == 'open' || blog.userId == curUserId) {
                lastBlogList.push(blog);
            }
        });
    } else {
        return new ErrorModel(getBlogFailInfo);
    }
    return new SuccessModel({
        data: lastBlogList,
        msg: "获取博客列表成功"
    });
}

module.exports = {
    create,
    editBlog,
    deleteBlog,
    getBlogList,
    getBlogMenuList,
    getMenuByCode,
    updateLookRecoord,
};
