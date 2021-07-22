/**
 * @description user controller：1.处理业务逻辑，2.调用service处理好的数据，3.返回格式统一化
 */

const {getUserInfos, createUser, deleteUser, updateUser} = require("../service/user");
const {SuccessModel, ErrorModel} = require("../model/ResModel");
const {doCrypto} = require("../utils/cryp");
const {set} = require("../db/redis");

const {registerUserNameNotExistInfo, registerUserNameExistInfos, registerFailInfo, loginFaileInfos} = require("../model/ErrorInfos");
/**
 * @description 用户名是否存在
 */
async function isExist(userName) {
    const userInfos = await getUserInfos(userName);
    if(userInfos) {
        // {code: 500, data: uerInfos, msg: "用户名已存在"}
        return new ErrorModel({
            userInfos,
            ...registerUserNameNotExistInfo
        })
    }else {
        // {code: 200, data: userInfos, msg: "用户名不存在"}
        return  new SuccessModel({
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
async function register({userName, password, gender}) {
    const userInfo = await getUserInfos(userName);
    //先对用户名校验是否存在
    if(userInfo) {
        return new ErrorModel(registerUserNameExistInfos);
    }

    //注册 service
    try {
        let result = createUser({
            userName,
            password: doCrypto(password),
            gender
        })
        return new SuccessModel({
            msg: "注册成功",
            data: ""
        })
    } catch (e) {
        return  new ErrorModel(registerFailInfo);
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
    if(userInfo) {
        //登陆成功将用户信息存到session中
        // ctx.session.userInfo = userInfo;
        // set("userInfo", userInfo);

        // 登录成功（redis 存 session 暂时无法实现）
        if (ctx.session.userInfo == null) {
            ctx.session.userInfo = userInfo;
        }

        return new SuccessModel({
            msg: "登陆成功",
            data: ""
        })
    }else {
        return  new ErrorModel(loginFaileInfos);
    }
}

/**
 * 删除当前用户相关信息
 * @param userName
 * @returns {Promise<void>}
 */
async function deleteCurUser(userName) {
     const result = await deleteUser(userName);
     if(result) {
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
    if(!userInfos) {
        return new ErrorModel({
            data: "",
            msg: "获取用户基本信息失败"
        })
    }else {
        return  new SuccessModel({
            data: userInfos,
            msg: "成功获取用户基本信息"
        })
    }
}

/**
 * 修改用户信息
 * @param ctx
 * @param nickName
 * @param city
 * @param picture
 * @returns {Promise<void>}
 */
async function changeInfo(ctx, {nickName, city, picture}) {
    const { userName } = ctx.session.userInfo;

    const result = await updateUser(
        {
            newNickName: nickName,
            newCity: city,
            newPicture: picture,
        }, {
            userName
        })

    if(result) {
        //修改用户信息成功，要同时更新session中userInfo
        Object.assign(ctx.session.userInfo, {
            nickName,
            city,
            picture
        })
        return new SuccessModel({
            msg: "修改用户信息成功",
            data: ""
        })
    }else {
        return new ErrorModel({
            data: "",
            msg: "修改用户信息失败"
        })
    }

}


async function changePassword({userName, password, newPassword}) {
    debugger
    const result = await updateUser({
        newPassword: doCrypto(newPassword)
    }, {
        userName,
        password: doCrypto(password)
    })
    if(result) {
        return new SuccessModel({
            msg: "修改用户密码成功",
            data: ""
        })
    }else {
        return new ErrorModel({
            data: "",
            msg: "修改用户密码失败"
        })
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
    deleteCurUser,
    changeInfo,
    changePassword,
    logout,
    getUserInfo
}
