/**
 * 存放通用的工具接口：上传图片、获取博客类型之类
 * */
const router = require('koa-router')();
const { loginCheck } = require("../../middlewares/loginChecks");
const koaFrom = require("formidable-upload-koa");
const { saveFile } = require("../../controller/untils");
router.prefix("/api/utils");

// 上传图片
router.post("/upload", koaFrom(), async (ctx, next) => {
    const file = ctx.req.files["file"];
    const {size, path, name, type} = file;
    ctx.body = await saveFile({
        name,
        type,
        size,
        filePath: path
    })
});

module.exports = router;
