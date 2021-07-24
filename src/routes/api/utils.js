/**
 * 存放通用的工具接口：上传图片、获取博客类型之类
 * */
const router = require('koa-router')();
const { loginCheck } = require("../../middlewares/loginChecks");
const koaFrom = require("formidable-upload-koa");

const { saveFile } = require("../../controller/untils");
const { getEnums } = require("../../controller/blog-home");

router.prefix("/api/utils");

//上传图片
router.post("/upload", loginCheck, koaFrom(), async (ctx, next) => {
    const file = ctx.req.files["file"];
    const {size, path, name, type} = file;
    ctx.body = await saveFile({
        name,
        type,
        size,
        filePath: path
    })
})

//获取博客类型枚举值
router.get("/getEnums", loginCheck, koaFrom(), async (ctx, next) => {
    ctx.body = await getEnums()
});

module.exports = router;
