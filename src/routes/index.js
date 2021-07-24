const router = require('koa-router')();
const {set, get} = require("../db/redis");
const {loginRedirect, loginCheck} = require("../middlewares/loginChecks");

/**
 * 测试登录验证的中间件：未登录时重定向页面
 * */
router.get('/string', loginRedirect, async (ctx, next) => {
  ctx.body = {
    title: 'koa2 string',
  }
});

/**
 * 测试登录验证的中间件：未登录的时候接口返回未登录提示
 * */
router.get('/json', loginCheck, async (ctx, next) => {
  let viewNum = await get("viewNum");
  let num = viewNum ? viewNum : 1;
  num = num + 1;
  set('viewNum', num);

  ctx.body = {
    title: 'koa2 json',
    viewNum
  }
});

module.exports = router;
