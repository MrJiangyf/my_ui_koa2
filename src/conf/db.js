/**
 * @description 存储配置
 * @type {{port: number, host: string}}
 */

// const {isPort} = require("");

let REDIS_CONF = {
    port: 6379,
    host: "121.40.223.28",
    password: "jiangyf@877253"
}

let MYSQL_CONF = {
    host: "121.40.223.28",
    user: "jiangyf",
    password: "jiangyf@877253",
    port: "3306",
    database: "koa2_weibo_db"
}

module.exports = {
    REDIS_CONF,
    MYSQL_CONF,
}

