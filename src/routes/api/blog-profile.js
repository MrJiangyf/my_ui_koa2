/**
 * @description 个人主页 api
 */
const {loginCheck} = require("../../middlewares/loginChecks");
const { getProfileBlogList } = require('../../controller/blog-profile');
const {getBlogListStr} = require("../../utils/blog")
const router = require('koa-router')();
router.prefix("/api/profile");


/**
 * 个人主页博客列表数据
 */
router.post("/getBlogList", async (ctx, next) => {
    const {pageIndex, pageSize, userName} = ctx.request.body;
    // 获取微博第一页的数据
    const result = await getProfileBlogList({
        userName, pageIndex: 1, pageSize: 10
    });
    // 返回博客列表相关数据
    ctx.body = result;
});

/**
 * 微博加载更多接口
 */
router.get("/loadMore/:userName/:pageIndex", async (ctx, next) => {
    let result = await getProfileBlogList({userName, pageIndex});
    let blogList = result.data;

    // 处理 博客列表 为html结构
    result.data.blogListTpl = getBlogListStr(result.daga.blogList);

    ctx.body = result;
});


module.exports = router;
