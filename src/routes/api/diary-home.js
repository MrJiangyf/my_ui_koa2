/**
 * @description 首页
 */
const router = require('koa-router')();
router.prefix("/api/diary");
const { create, editDiary, updateLookRecoord, deleteDiary, getDiaryList } = require("../../controller/diary-home");
const { genValidator } = require("../../middlewares/validator");
const articleValidate = require("../../validator/article");
const { loginCheck } = require("../../middlewares/loginChecks");
/**
 * 新增日记内容接口
 * */
router.post("/create", loginCheck, genValidator(articleValidate), async (ctx, next) => {
    const { pictures, content, title, auth, address, lon, lat } = ctx.request.body;
    const { id } = ctx.session.userInfo;
    ctx.body = await create({ userId: id, pictures, content, title, auth, address, lon, lat });
});
/**
 * 删除日记内容接口
 * */
router.post("/deleteDiary", async (ctx, next) => {
    const { diaryId } = ctx.request.body;
    ctx.body = await deleteDiary(diaryId);
});
/**
 * 编辑日记内容接口
 * */
router.post("/editDiary", loginCheck, genValidator(articleValidate), async (ctx, next) => {
    const { diaryId, content, title, auth, pictures } = ctx.request.body;
    ctx.body = await editDiary({ diaryId, pictures, content, title, auth });
});

/**
 * 更新日记查看记录
 * */
router.post("/updateLookRecoord", loginCheck, async (ctx, next) => {
    const { diaryId } = ctx.request.body;
    ctx.body = await updateLookRecoord(diaryId);
});

/**
 * 获取日记信息
 * */
router.get("/getDiaryList", loginCheck, async (ctx, next) => {
    const { diaryId, userId, pageIndex, pageSize } = ctx.request.query;
    // 获取日记第一页的数据
    const result = await getDiaryList({
        pageIndex: pageIndex || 0,
        pageSize: pageSize || 1000,
        diaryId,
        userId,
    });
    // 返回日记列表相关数据
    ctx.body = result;
});

module.exports = router;