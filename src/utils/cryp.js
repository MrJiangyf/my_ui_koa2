/**
 * @description 加密方法
 */

const crypto = require("crypto");
const {CRYPTO_SECRET_KEY} = require("../conf/secretKeys");


/**
 * md5 加密
 * @param content 明文
 * @returns {PromiseLike<ArrayBuffer>}
 */
function md5(content) {
    const md5 = crypto.createHash("md5");
    return md5.update(content).digest("hex");
}

/**
 * 加密方法
 * @param content
 * @returns {*}
 */
function doCrypto(content) {
    const str = `password=${content}&key=${CRYPTO_SECRET_KEY}`;
    return md5(str);
}

module.exports = {
    doCrypto
}
