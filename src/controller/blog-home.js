/**
 * @description 首页
 */
const {createBlog, getAllEnums} = require("../service/blog");
const {SuccessModel, ErrorModel} = require("../model/ResModel");
const xss = require("xss");
/**
 * 创建微博
 * @param content
 * @param image
 * @param userId
 * @returns {Promise<void>}
 */
async function create({content, image, userId, title, type}) {
         try {
             // 创建微博
             const blog = await createBlog({
                 content: xss(content),
                 image,
                 userId,
                 title,
                 type,
             })
             return new SuccessModel({
                 data: blog,
                 msg: "创建成功"
             })
         }catch (e) {
             console.error(e.message, e.stack);
             return new ErrorModel({
                 data: "",
                 msg: "创建失败"
             })
         }
}

async function getEnums() {
    const result = await getAllEnums();
    if(result) {
        return new SuccessModel({
            data: result,
            msg: "获取枚举列表成功"
        })
    }else {
        return new ErrorModel({
            data: "",
            msg: "获取枚举列表失败"
        })
    }
}


module.exports = {
    create,
    getEnums,
}
