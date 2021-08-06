/**
 * @description 首页
 */
const { createBlog } = require("../service/blog");
const { SuccessModel, ErrorModel } = require("../model/ResModel");
const xss = require("xss");
const { createBlogFailInfo } = require("../model/ErrorInfos");
/**
 * 创建博客
 * @param content
 * @param image
 * @param userId
 * @returns {Promise<void>}
 */
async function create({content, image, userId, title, type}) {
         try {
             // 创建博客
             const blog = await createBlog({
                 content: xss(content),
                 image,
                 userId,
                 title,
                 type,
             });
             return new SuccessModel({
                 data: blog,
                 msg: "创建成功"
             });
         }catch (e) {
             console.error(e.message, e.stack);
             return new ErrorModel(createBlogFailInfo);
         }
}


module.exports = {
    create,
};
