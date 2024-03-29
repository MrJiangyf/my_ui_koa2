const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const { isProd } = require("./utils/env");
const path = require("path");
const koaStatic = require("koa-static");
const fs = require("fs");
const winston = require('winston');
const morgan = require("koa-morgan");
// 设置 Winston 日志记录器
const errLogFilePath = path.join(__dirname, "..", "logs", "error.log");
const errLogger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: errLogFilePath, level: 'error' }),
    ],
});
// 路由
const index = require('./routes/index');
const userViewRouter = require("./routes/view/user");
// 接口路由
const userApiRouter = require("./routes/api/user");
const untilsApiRouter = require("./routes/api/utils");
const enumsApiRouter = require("./routes/api/enums");
const articleHomeApiRouter = require("./routes/api/article-home");
const diaryHomeApiRouter = require("./routes/api/diary-home");
// redis
const session = require('koa-generic-session');
const redisStore = require('koa-redis');
const { REDIS_CONF } = require("./conf/db");
const { SESSION_SECRET_KEY } = require("./conf/secretKeys");

/**
 * error handlere
 * */
let onerrorConf = {};
if (isProd) {
    onerrorConf = {
        redirect: "/error"
    }
    //生产环境写日志文件路径
    const aceessPathName = path.join(__dirname, "..", "logs", "access.log");
    const writeStream = fs.createWriteStream(aceessPathName, {
        flag: "a"
    })
    app.use(
        morgan('combined', { stream: writeStream })
    );
}
onerror(app, onerrorConf);

/**
 * 中间件：日志
 * */
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}));
app.use(json());
app.use(logger());
app.use(koaStatic(__dirname + '/public'));
app.use(koaStatic(path.join(__dirname, "..", "uploadFiles")));
app.use(views(__dirname + '/views', {
    extension: 'ejs'
}));

// logger
app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    errLogger.error(`${ctx.method} ${ctx.url} - ${ms}ms`);
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

/**
 * session 配置
 * */
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
        password: REDIS_CONF.password,
    })
}));

/**
 * 统一处理错误
 * 由于next(),会调用下一个中间件函数（下一个中间件的next也同理），因此当执行后面的next函数出错时，会被捕获到。
 * */
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        errLogger.error(`出错了，原因：${err}!`);
        console.log(`出错了，原因：${err}!`);
        ctx.body = {
            code: 500,
            msg: `出错了，原因：${err}!`
        };
    }
});

/**
 * 路由相关
 * */
app.use(index.routes(), index.allowedMethods());
app.use(userViewRouter.routes(), userViewRouter.allowedMethods());
// 接口路由
app.use(userApiRouter.routes(), userApiRouter.allowedMethods());
app.use(untilsApiRouter.routes(), untilsApiRouter.allowedMethods());
app.use(enumsApiRouter.routes(), enumsApiRouter.allowedMethods());
app.use(articleHomeApiRouter.routes(), articleHomeApiRouter.allowedMethods());
app.use(diaryHomeApiRouter.routes(), diaryHomeApiRouter.allowedMethods());
/**
 * error-handling
 * */
app.on('error', (err, ctx) => {
    errLogger.error(`出错了，原因：${err}!`);
    console.error('server error', err, ctx)
});

module.exports = app;
