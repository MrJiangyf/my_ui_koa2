/**
 * @description 首页
 */
const xss = require("xss");
const { createDiary, deleteDiaryInfos, editDiaryInfos, updateDiaryRecoord, filterDiaryList } = require("../service/diary.js");
const { SuccessModel, ErrorModel } = require("../model/ResModel.js");
const { createDiaryFailInfo, getDiaryFailInfo } = require("../model/ErrorInfos.js");
const { filterBlogList } = require("../service/article.js");
const { getTypeEnums } = require("../service/enums.js");
/**
 * 创建日记
 */
async function create(params) {
    try {
        const diary = await createDiary({
            ...params,
            content: xss(params.content),
        });
        return new SuccessModel({
            data: diary,
            msg: "创建成功"
        });
    } catch (e) {
        return new ErrorModel(createDiaryFailInfo);
    }
}
/**
 * 编辑日记
 */
async function editDiary({ diaryId, content, title, pictures, auth }) {
    try {
        // 编辑日记
        const result = await editDiaryInfos({
            content: xss(content),
            diaryId,
            title,
            pictures,
            auth
        });
        if (result) {
            return new SuccessModel({
                data: result,
                msg: "成功编辑文章!"
            });
        } else {
            return new ErrorModel(editDiaryFailInfo);
        }
    } catch (e) {
        return new ErrorModel(editDiaryFailInfo);
    }
}
/**
 * 查看日记记录
 */
async function updateLookRecoord(id) {
    const result = await updateDiaryRecoord(id);
    if (result) {
        return new SuccessModel({
            data: "",
            msg: '更新成功',
        })

        return new ErrorModel({
            data: "",
            msg: "更新失败"
        })
    }
}
/**
 * 删除文章
 */
async function deleteDiary(id) {
    const result = await deleteDiaryInfos(id);
    if (result) {
        return new SuccessModel({
            data: "",
            msg: '删除成功',
        })

        return new ErrorModel({
            data: "",
            msg: "删除失败"
        })
    }
}

/**
 * 获取日记列表
 */
async function getDiaryList({ diaryId, userId, pageIndex = 1, pageSize = 10 }) {
    const result = await filterDiaryList({
        diaryId,
        userId,
        pageIndex,
        pageSize,
    });
    if (result) {
        return new SuccessModel({
            data: {
                diaryList: result.diaryList,
                isEmpty: result.diaryList.length == 0,
                count: result.count || 0
            },
            msg: "获取日记列表成功"
        });
    } else {
        return new ErrorModel(getDiaryFailInfo);
    }
}

module.exports = {
    create,
    editDiary,
    deleteDiary,
    getDiaryList,
    updateLookRecoord,
};
