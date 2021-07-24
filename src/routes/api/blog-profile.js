/**
 * @description 个人主页 api
 */
const {loginCheck} = require("../../middlewares/loginChecks");
const { getProfileBlogList } = require('../../controller/blog-profile');
const router = require('koa-router')();
router.prefix("/api/profile");


/**
 * 个人主页博客列表数据
 */
router.post("/getBlogList", loginCheck, async (ctx, next) => {
    const {pageIndex, pageSize, userName} = ctx.request.body;
    // 获取微博第一页的数据
    const result = await getProfileBlogList({
        userName,
        pageIndex: pageIndex || 1,
        pageSize: pageSize || 10
    });
    // 返回博客列表相关数据
    ctx.body = result;
});

module.exports = router;
