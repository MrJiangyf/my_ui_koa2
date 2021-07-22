const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const {isProd} = require("./utils/env");
const path = require("path");
const koaStatic = require("koa-static");

//路由
const errorViewRouter = require('./routes/view/error');
const index = require('./routes/index')
const users = require('./routes/users')
const userViewRouter = require("./routes/view/user");
const userApiRouter = require("./routes/api/user");
const untilsApiRouter = require("./routes/api/utils");
const blogViewRouter = require("./routes/view/blog");
const blogHomeApiRouter = require("./routes/api/blog-home");
const blogProfileApiRouter = require("./routes/api/blog-profile");

//redis
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const {REDIS_CONF} = require("./conf/db")
const {SESSION_SECRET_KEY} = require("./conf/secretKeys")

// error handlere
let onerrorConf = {};
if (isProd) {
    onerrorConf = {
        redirect: "/error"
    }
}
onerror(app, onerrorConf)

// 中间件：日志
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(koaStatic(__dirname + '/public'));
app.use(koaStatic(path.join(__dirname, "..", "uploadFiles")));

app.use(views(__dirname + '/views', {
    extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// session 配置
app.keys = [SESSION_SECRET_KEY];
app.use(session({
    key: 'tokenId', // cookie name 默认是 `koa.sid`
    prefix: 'weibo:sess:', // redis key 的前缀，默认是 `koa:sess:`
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000  // 单位 ms
    },
    // 配置 redis
    store: redisStore({
        host: REDIS_CONF.host,
        port: REDIS_CONF.port,
    })
}))

// 路由相关
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(userViewRouter.routes(), userViewRouter.allowedMethods())
app.use(userApiRouter.routes(), userApiRouter.allowedMethods())
app.use(untilsApiRouter.routes(), untilsApiRouter.allowedMethods())
app.use(blogViewRouter.routes(), blogViewRouter.allowedMethods())
app.use(blogHomeApiRouter.routes(), blogHomeApiRouter.allowedMethods())
app.use(blogProfileApiRouter.routes(), blogProfileApiRouter.allowedMethods())
app.use(errorViewRouter.routes(), errorViewRouter.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

module.exports = app
