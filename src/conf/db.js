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
// grant all privileges on koa2_weibo_db.* to jiangyf@localhost identified by 'Zlh@1234';
// grant all on koa2_weibo_db.* to 'jiangyf'@'%' identified by '123456' with grant option;

module.exports = {
    REDIS_CONF,
    MYSQL_CONF,
}

