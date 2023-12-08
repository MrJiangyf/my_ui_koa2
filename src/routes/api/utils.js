/**
 * 存放通用的工具接口：上传图片、获取博客类型之类
 * */
const router = require('koa-router')();
const { loginCheck } = require("../../middlewares/loginChecks");
const koaFrom = require("formidable-upload-koa");
const { saveUserPhoto, saveArticleImg, saveDiaryImg } = require("../../controller/untils");
router.prefix("/api/utils");

// 上传用户头像
router.post("/uploadUserPhotos", koaFrom(), async (ctx, next) => {
    const file = ctx.req.files["file"];
    const { size, path, name, type } = file;
    ctx.body = await saveUserPhoto({
        ctx,
        name,
        type,
        size,
        filePath: path
    })
});

// 上传文章图片
router.post("/uploadArticleImgs", koaFrom(), async (ctx, next) => {
    const file = ctx.req.files["file"];
    const { size, path, name, type } = file;
    ctx.body = await saveArticleImg({
        ctx,
        name,
        type,
        size,
        filePath: path
    })
});

// 上传日记图片
router.post("/uploadDiaryImgs", koaFrom(), async (ctx, next) => {
    const file = ctx.req.files["file"];
    const { size, path, name, type } = file;
    ctx.body = await saveDiaryImg({
        ctx,
        name,
        type,
        size,
        filePath: path
    })
});


module.exports = router;
