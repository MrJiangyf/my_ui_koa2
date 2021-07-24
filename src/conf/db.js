/**
 * @description 存储配置
 * @type {{port: number, host: string}}
 */

// const {isPort} = require("");

let REDIS_CONF = {
    port: 6379,
    host: "47.100.69.250"
}

let MYSQL_CONF = {
    host: "47.100.69.250",
    user: "jiangyf",
    password: "123456",
    port: "3306",
    database: "koa2_weibo_db"
}

module.exports = {
    REDIS_CONF,
    MYSQL_CONF,
}

