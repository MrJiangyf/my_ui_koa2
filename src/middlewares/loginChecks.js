/**
 * @description 登录验证的中间件
 */

const { ErrorModel } = require('../model/ResModel');
const { SESSION_SECRET_KEY } = require("../conf/secretKeys");
const jwt = require('jsonwebtoken');
const { getUserInfos } = require("../service/user");
/**
 * API 登录验证
 * @param {Object} ctx ctx
 * @param {function} next next
 */
async function loginCheck(ctx, next) {
    const tokenId = ctx.header.tokenId || ctx.header.tokenid;
    if (ctx.session && ctx.session.userInfo) {
        // 已登录
        await next();
        return
    } else if (tokenId) {
        // 微信一键登陆，用请求头中的token做校验，从token中解析出用户信息，并将用户信息存放到 ctx.session 中
        const data = await jwt.verify(tokenId, SESSION_SECRET_KEY, async (err, decoded) => {
            if (err) {
                return {
                    msg: "Token验证失败",
                    code: 200,
                }
            } else {
                const userInfo = await getUserInfos(decoded.userNmae)
                ctx.session.userInfo = userInfo;
                return {
                    msg: "Token验证成功",
                    code: 200
                }
            }
        });
        if (data.code == 200) {
            await next();
            return;
        } else {
            // 未登录
            ctx.body = new ErrorModel({
                code: 500,
                msg: data.msg || "未登录"
            })
        }
        return;
    }
    // 未登录
    ctx.body = new ErrorModel({
        code: 500,
        msg: "未登录"
    })
}

/**
 * 页面登录验证
 * @param {Object} ctx ctx
 * @param {function} next next
 */
async function loginRedirect(ctx, next) {
    if (ctx.session && ctx.session.userInfo) {
        // 已登录
        await next();
        return;
    }
    // 未登录
    const curUrl = ctx.url;
    ctx.redirect('/login?url=' + encodeURIComponent(curUrl));
}

module.exports = {
    loginCheck,
    loginRedirect
}
