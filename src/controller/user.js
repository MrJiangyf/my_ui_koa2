/**
 * @description user controller：1.处理业务逻辑，2.调用service处理好的数据，3.返回格式统一化
 */
// 引入request-promise模块
const rp = require('request-promise');
const jwt = require('jsonwebtoken');
const { getUserInfos, createUser, deleteUser, updateUser } = require("../service/user");
const { SuccessModel, ErrorModel } = require("../model/ResModel");
const { doCrypto } = require("../utils/cryp");
const { set } = require("../db/redis");
const { SESSION_SECRET_KEY } = require("../conf/secretKeys");

const { registerUserNameExistInfo, registerFailInfo, loginFailInfo, changePasswordFailInfo,
    getUserInfoFailInfo, changeInfoFailInfo } = require("../model/ErrorInfos");
/**
 * @description 用户名是否存在
 */
async function isExist(userName) {
    const userInfos = await getUserInfos(userName);
    if (userInfos) {
        // {code: 500, data: uerInfos, msg: "用户名已存在"}
        return new ErrorModel({
            data: userInfos,
            ...registerUserNameExistInfo
        })
    } else {
        // {code: 200, data: userInfos, msg: "用户名不存在"}
        return new SuccessModel({
            userInfos,
            msg: "用户名不存在"
        })
    }
}

/**
 * 注册
 * @param username
 * @param password
 * @param gender
 * @returns {Promise<*>}
 */
async function register({ userName, password, gender }) {
    const userInfo = await getUserInfos(userName);
    //先对用户名校验是否存在
    if (userInfo) {
        return new ErrorModel(registerUserNameExistInfo);
    }
    //注册 service
    try {
        let result = createUser({
            userName,
            password: doCrypto(password),
            gender,
        });
        if (result) {
            return new SuccessModel({
                msg: "注册成功",
                data: ""
            })
        } else {
            return new ErrorModel(registerFailInfo);
        }
    } catch (e) {
        return new ErrorModel(registerFailInfo);
    }
}

/**
 * 登陆
 * @param userName
 * @param password
 * @returns {Promise<ErrorModel|SuccessModel>}
 */
async function login(ctx, userName, password) {
    const userInfo = await getUserInfos(userName, doCrypto(password));
    if (userInfo) {
        //登陆成功将用户信息存到session中
        // ctx.session.userInfo = userInfo;
        // set("userInfo", userInfo);

        // 登录成功（redis 存 session 暂时无法实现）
        if (ctx.session.userInfo == null) {
            ctx.session.userInfo = userInfo;
        }
        return new SuccessModel({
            msg: "登陆成功",
            data: {
                tokenId: ctx.sessionId
            }
        })
    } else {
        return new ErrorModel(loginFailInfo);
    }
}

/**
 * 微信小程序登陆
 * @param userName
 * @param password
 * @returns {Promise<ErrorModel|SuccessModel>}
 */
// 解密微信用户数据
const decodeUserInfo = (encryptedData, iv, sessionKey) => {
    // 以下代码来源于微信开发文档
    const crypto = require('crypto');
    const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv);
    let decoded = decipher.update(encryptedData, 'base64', 'utf8');
    decoded += decipher.final('utf8');
    decoded = JSON.parse(decoded);
    return decoded;
};
async function wxLogin(ctx, code, userInfo) {
    // 调用微信API，使用Code获取SessionKey和OpenId
    const appid = 'wx754b21cee0ad6ddb';  // 请填写自己的appid
    const secret = '86765afd91a6db12a084257cd961c7b0';  // 请填写自己的secret
    const grant_type = 'authorization_code';
    const options = {
        uri: 'https://api.weixin.qq.com/sns/jscode2session',
        qs: {
            appid,
            secret,
            js_code: code,
            grant_type
        },
        json: true
    };
    const { session_key, openid } = await rp(options) || {};
    if (session_key && openid) {
        // 将用户信息、openid、session_key 转成 token 返回前端，方便在拦截校验中间层获取用户信息
        const user = {
            openid: openid,
            sessionKey: session_key,
            ...userInfo,
        };
        const tokenId = jwt.sign(user, SESSION_SECRET_KEY, { expiresIn: '1h' }); // 设置Token的过期时间
        return new SuccessModel({
            data: {
                tokenId: tokenId
            },
            msg: "登陆成功"
        })
    } else {
        return new ErrorModel({
            msg: "授权失败",
            data: {}
        });
    }
}

/**
 * 删除当前用户相关信息
 * @param userName
 * @returns {Promise<void>}
 */
async function deleteCurUser(userName) {
    const result = await deleteUser(userName);
    if (result) {
        return new SuccessModel({
            data: "",
            msg: '删除成功',
        })

        return new ErrorModel({
            data: "",
            msg: "删除失败"
        })
    }
}

/**
 * 获取用户基本信息
 * @param userName
 * @returns {Promise<ErrorModel|SuccessModel>}
 */
async function getUserInfo(userName) {
    const userInfos = await getUserInfos(userName);
    if (!userInfos) {
        return new ErrorModel(getUserInfoFailInfo)
    } else {
        return new SuccessModel({
            data: userInfos,
            msg: "成功获取用户基本信息"
        })
    }
}
/**
 * 修改用户信息
 * @param ctx
 * @param nickName
 * @param picture
 * @returns {Promise<void>}
 */
async function changeInfo(ctx, { nickName, picture, gender }) {
    const { userName } = ctx.session.userInfo;

    const result = await updateUser(
        {
            newNickName: nickName,
            newPicture: picture,
            newGender: gender
        }, {
        userName
    });

    if (result) {
        //修改用户信息成功，要同时更新session中userInfo
        Object.assign(ctx.session.userInfo, {
            nickName,
            picture,
            gender
        });
        return new SuccessModel({
            msg: "修改用户信息成功",
            data: ""
        })
    } else {
        return new ErrorModel(changeInfoFailInfo);
    }

}


async function changePassword({ userName, password, newPassword }) {
    const result = await updateUser({
        newPassword: doCrypto(newPassword)
    }, {
        userName,
        password: doCrypto(password)
    })
    if (result) {
        return new SuccessModel({
            msg: "修改用户密码成功",
            data: ""
        })
    } else {
        return new ErrorModel(changePasswordFailInfo)
    }
}


async function logout(ctx) {
    delete ctx.session.userInfo;
    return new SuccessModel({
        msg: "成功退出"
    })
}

module.exports = {
    isExist,
    register,
    login,
    wxLogin,
    deleteCurUser,
    changeInfo,
    changePassword,
    logout,
    getUserInfo
}
