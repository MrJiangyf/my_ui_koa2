const {ErrorModel, SuccessModel} = require("../model/ResModel");
const path = require("path");
const fse = require("fs-extra");
// 文件最大体积 10000M
const MIX_SIZE = 1024 * 1024 * 1024 * 1000;

/**
 * 保存用户头像图片
 */
async function saveUserPhoto({ctx, name, type, size, filePath}) {
    if (size > MIX_SIZE) {
        await fse.remove(filePath);
        return new ErrorModel({
            data: "",
            msg: `文件过大，不能超过${MIX_SIZE}!`
        })
    }
    let userId = ctx.session.userInfo.id;
    // 文件存储目录
    const userPhotos_save_img = path.join(__dirname, "..", "..", "uploadFiles", "user_photos", "userId_"+userId);
    // 判断uploadFiles目录是否存在，不存在就创建
    fse.pathExists(userPhotos_save_img).then(exist => {
        if (!exist) {
            fse.ensureDir(userPhotos_save_img);
        }
    });
    // 移动上传文件到指定目录存储
    const fileName = Date.now() + "_" + name; //防止重名
    const distFilePath = path.join(userPhotos_save_img, fileName);
    await fse.move(filePath, distFilePath);

    // 返回信息（在app.js中配置uploadFiles目录为静态资源目录，这样就可以通过："/文件名"访问到文件）
    return new SuccessModel({
        data: {url: `/user_photos/userId_${userId}/` + fileName},
        msg: "上传成功"
    });
}

/**
 * 保存日记图片
 */
async function saveDiaryImg({ctx, name, type, size, filePath}) {
    if (size > MIX_SIZE) {
        await fse.remove(filePath);
        return new ErrorModel({
            data: "",
            msg: `文件过大，不能超过${MIX_SIZE}!`
        })
    }
    let userId = ctx.session.userInfo.id;
    // 文件存储目录
    const diaryPhotos_save_img = path.join(__dirname, "..", "..", "uploadFiles", "diary_photos", "userId_"+userId);
    // 判断uploadFiles目录是否存在，不存在就创建
    fse.pathExists(diaryPhotos_save_img).then(exist => {
        if (!exist) {
            fse.ensureDir(diaryPhotos_save_img);
        }
    });
    // 移动上传文件到指定目录存储
    const fileName = Date.now() + "_" + name; //防止重名
    const distFilePath = path.join(diaryPhotos_save_img, fileName);
    await fse.move(filePath, distFilePath);

    // 返回信息（在app.js中配置uploadFiles目录为静态资源目录，这样就可以通过："/文件名"访问到文件）
    return new SuccessModel({
        data: {url: `/diary_photos/userId_${userId}/` + fileName},
        msg: "上传成功"
    });
}

/**
 * 保存文章图片
 */
async function saveArticleImg({ctx, name, type, size, filePath}) {
    if (size > MIX_SIZE) {
        await fse.remove(filePath);
        return new ErrorModel({
            data: "",
            msg: `文件过大，不能超过${MIX_SIZE}!`
        })
    }
    let userId = ctx.session.userInfo.id;
    // 文件存储目录
    const articleImg_save_path = path.join(__dirname, "..", "..", "uploadFiles", "article_imgs", "userId_"+userId);
    // 判断uploadFiles目录是否存在，不存在就创建
    fse.pathExists(articleImg_save_path).then(exist => {
        if (!exist) {
            fse.ensureDir(articleImg_save_path);
        }
    });
    // 移动上传文件到指定目录存储
    const fileName = Date.now() + "_" + name; //防止重名
    const distFilePath = path.join(articleImg_save_path, fileName);
    await fse.move(filePath, distFilePath);
    // 返回信息（在app.js中配置uploadFiles目录为静态资源目录，这样就可以通过："/文件名"访问到文件）
    return new SuccessModel({
        data: {url: `http://baseArticleImgPath/article_imgs/userId_${userId}/` + fileName},
        msg: "上传成功"
    });
}

module.exports = {
    saveArticleImg,
    saveUserPhoto,
    saveDiaryImg
};
