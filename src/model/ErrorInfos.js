/**
 * @description 失败信息集合，包括 code 和 msg
 */

module.exports = {
    // 用户名已存在
    registerUserNameExistInfo: {
        code: 10001,
        msg: '用户名已存在'
    },
    // 注册失败
    registerFailInfo: {
        code: 10002,
        msg: '注册失败，请重试'
    },
    // 用户名不存在
    registerUserNameNotExistInfo: {
        code: 10003,
        msg: '用户名未存在'
    },
    // 登录失败
    loginFailInfo: {
        code: 10004,
        msg: '登录失败，用户名或密码错误'
    },
    // 未登录
    loginCheckFailInfo: {
        code: 10005,
        msg: '您尚未登录'
    },
    // 修改密码失败
    changePasswordFailInfo: {
        code: 10006,
        msg: '修改失败，请重新输入旧密码'
    },
    // 上传文件过大
    uploadFileSizeFailInfo: {
        code: 10007,
        msg: '上传文件尺寸过大'
    },
    // 修改基本信息失败
    changeInfoFailInfo: {
        code: 10008,
        msg: '修改基本信息失败'
    },
    // json schema 校验失败
    jsonSchemaFileInfo: {
        code: 10009,
        msg: '数据格式校验错误'
    },
    // 删除用户失败
    deleteUserFailInfo: {
        code: 10010,
        msg: '删除用户失败'
    },
    // 获取用户基本信息失败
    getUserInfoFailInfo: {
        code: 10011,
        msg: "获取用户基本信息失败"
    },
    // 创建博客失败
    createBlogFailInfo: {
        code: 11001,
        msg: '创建博客失败，请重试'
    },
    // 编辑博客失败
    editBlogFailInfo: {
        code: 11001,
        msg: '编辑博客失败，请重试'
    },
    // 获取博客信息失败
    getBlogFailInfo: {
        code: 1101,
        msg: '获取博客信息失败，请重试'
    },
    // 删除博客失败
    deleteBlogFailInfo: {
        code: 11002,
        msg: '删除博客失败，请重试'
    },
    // 获取枚举列表失败
    getEmusErrorInfo: {
        code: 11003,
        msg: '获取枚举列表失败'
    }
}
