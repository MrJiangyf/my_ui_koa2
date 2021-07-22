const redis = require("redis");
const {REDIS_CONF} = require("../conf/db");

//创建redis客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host);
redisClient.on("error", (err) => {
    console.log(err);
})

function set(key, val) {
    if(typeof val === 'object') {
        val = JSON.stringify(val);
    }
    redisClient.set(key, val, redis.print);
}
function get(key) {
    let promise = new Promise((resolve, reject) => {
        redisClient.get(key, (err, res) => {
            if (err) {
                reject(err);
            }
            //对读取的返回结果进行处理
            if(res == null) {
                resolve(res);
            }
            try {
                resolve(JSON.parse(res));
            }catch (e) {
                resolve(res);
            }
        })

    });
    return promise;
}

module.exports = {
    set,
    get,
    redisClient
}


