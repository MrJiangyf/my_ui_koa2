const koaFrom = require("formidable-upload-koa");
const { typeEnums, labelEnums } = require("../../controller/enums");

const router = require('koa-router')();
router.prefix("/api/enums");

// 获取博客分类专栏枚举值
router.post("/getTypeEnums", async (ctx, next) => {
    ctx.body = await typeEnums()
});

// 获取博客标签枚举值
router.get("/getLabelEnums", koaFrom(), async (ctx, next) => {
    ctx.body = await labelEnums()
});

module.exports = router;
