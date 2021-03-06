/**
 * @description 服务端页面：登陆、注册界面的路由
 */
const router = require('koa-router')();

/**
 * 获取登录信息
 * @param {Object} ctx ctx
 */
function getLoginInfo(ctx) {
    let data = {
        isLogin: false // 默认未登录
    };
    const userInfo = ctx.session && ctx.session.userInfo;
    if (userInfo) {
        data = {
            isLogin: true,
            userName: userInfo.userName
        }
    }
    return data;
}

router.get('/login', async (ctx, next) => {
    await ctx.render('login', getLoginInfo(ctx))
});

router.get('/register', async (ctx, next) => {
    await ctx.render('register', getLoginInfo(ctx))
});

module.exports = router;
