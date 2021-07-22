const router = require('koa-router')()
const {set, get} = require("../db/redis");
const {loginRedirect, loginCheck} = require("../middlewares/loginChecks");

router.get('/testIndex', loginRedirect, async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 string',
  }
})

router.get('/json', loginCheck, async (ctx, next) => {
  let viewNum = await get("viewNum");
  let num = viewNum ? viewNum : 1;
  num = num + 1;
  set('viewNum', num);

  ctx.body = {
    title: 'koa2 json',
    viewNum
  }
})

module.exports = router
