const {ErrorModel, SuccessModel} = require("../model/ResModel");
const path = require("path");
const fse = require("fs-extra");

//文件最大体积 1M
const MIX_SIZE = 1024 * 1024 * 1024;
//文件存储目录
const DIST_SAVE_PATH = path.join(__dirname, "..", "..", "uploadFiles");
//判断uploadFiles目录是否存在，不存在就创建
fse.pathExists(DIST_SAVE_PATH).then(exist => {
    if (!exist) {
        fse.ensureDir(DIST_SAVE_PATH);
    }
})


/**
 * 保存文件
 * @param name 文件名
 * @param type 文件类型
 * @param size 文件体积
 * @param filePath 文件所在路径
 * @returns {Promise<void>}
 */
async function saveFile({name, type, size, filePath}) {
    if (size > MIX_SIZE) {
        await fse.remove(filePath);
        return new ErrorModel({
            data: "",
            msg: `文件过大，不能超过${MIX_SIZE}!`
        })
    }

    // 移动上传文件到指定目录存储
    const fileName = Date.now() + "_" + name; //防止重名
    const distFilePath = path.join(DIST_SAVE_PATH, fileName);
    await fse.move(filePath, distFilePath);

    // 返回信息（在app.js中配置uploadFiles目录为静态资源目录，这样就可以通过："/文件名"访问到文件）
    return new SuccessModel({
        data: {url: "/" + fileName},
        msg: "上传成功"
    });
}


module.exports = {
    saveFile
}
