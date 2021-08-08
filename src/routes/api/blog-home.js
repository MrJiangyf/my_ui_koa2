/**
 * @description 首页
 */
const {loginCheck} = require("../../middlewares/loginChecks");
const router = require('koa-router')();
router.prefix("/api/blog");
const {create, getBlogList, getBlogMenuList} = require("../../controller/blog-home");
const {genValidator} = require("../../middlewares/validator");
const blogValidate = require("../../validator/blog");
/**
 * 新增博客内容接口
 * */
router.post("/create", loginCheck, genValidator(blogValidate), async (ctx, next) => {
    const {content, title, type, labels, auth}  = ctx.request.body;
    const {id} = ctx.session.userInfo;
    const  userId = id;
    ctx.body = await create({userId, content, title, type, labels, auth});
});

/**
 * 获取博客信息
 * */
router.get("/getBlogList", loginCheck, async (ctx, next) => {
    const {blogId, userId, type, pageIndex, pageSize} = ctx.request.query;
    // 获取博客第一页的数据
    const result = await getBlogList({
        pageIndex: pageIndex || 0,
        pageSize: pageSize || 1000,
        blogId,
        userId,
        type
    });
    // 返回博客列表相关数据
    ctx.body = result;
});

/**
 * 获取左侧菜单列表数据
 * */
router.get("/getMenuList", loginCheck, async (ctx, next) => {
    const {userId, pageIndex, pageSize} = ctx.request.query;
    const result = await getBlogMenuList({
        ctx,
        pageIndex: pageIndex || 0,
        pageSize: pageSize || 1000,
        userId,
    });
    // 返回博客列表相关数据
    ctx.body = result;
});

module.exports = router;
