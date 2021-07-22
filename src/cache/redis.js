/**
 *@description 连接redis方法： get  set
 */

const redis = require("redis");
const {REDIS_CONF} = require("../conf/db");

//创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host);
redisClient.on("error", err => {
    console.log("redis error", err);
});

/**
 * redis set设置值
 * @param key
 * @param val
 * @param timeout，过期时间，单位: s
 */
function set(key, val, timeout = 60 * 60) {
   if(typeof val === 'object') {
       val = JSON.stringify(val);
   }
   redisClient.set(key, val);
   redisClient.expire(key, timeout);
}

/**
 * redis get获取指定key的值
 * @param key
 */
function get(key) {
   const promise = new Promise((resolve, reject) => {
       redisClient.get(key, (err, val) => {
           if(err) {
               reject(err);
               return;
           }
           if(val == null) {
               resolve(null);
               return;
           }

           //如果val拿到的是一个字符串对象，则将其JSON.parse转成对象，如果不是对象则直接resolve(val)；
           try {
               resolve(JSON.parse(val));
           }catch (e) {
               resolve(val)
           }
       })

       return promise;
   })
}
