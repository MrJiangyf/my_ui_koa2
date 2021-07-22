/**
 * @description 微博 view 路由
 * @author 双越老师
 */

const router = require('koa-router')()
const { loginRedirect } = require('../../middlewares/loginChecks')
const { getProfileBlogList } = require('../../controller/blog-profile')

// 首页
router.get('/', loginRedirect, async (ctx, next) => {
    const userInfo = ctx.session.userInfo;
    const { id: userId } = userInfo;
    await ctx.render('index', {})
});

// 个人主页
router.get("/profile", loginRedirect, async (ctx, next) => {
     const {userName} = ctx.session.userInfo;
     ctx.redirect(`/profile/${userName}`);
});
router.get("/profile/:userName", loginRedirect, async (ctx, next) => {
    let pageSize = 5, pageIndex = 1;
     const  {userName: curUserName} = ctx.params; //获取路径中"/:userName"变量（即：用户名）
     // 获取微博第一页的数据
     const result = await getProfileBlogList({
         userName: curUserName, pageIndex: 1, pageSize: 5
     });
     const {blogList, count, isEmpty} = result.data;
     await ctx.render("profile", {
         blogData: {
             isEmpty,
             blogList,
             pageIndex,
             count,
             pageSize,
         }
     })
})


module.exports = router;
