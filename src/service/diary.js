/**
 * @description 日记
 */
const { Diary, User } = require("../db/model/index");
const { formatUser, formatBlog } = require("../utils/data_format");
/**
 * 创建日记
 */
async function createDiary(params) {
    const result = await Diary.create({
        lookNums: 0,
        ...params
    });
    return result.dataValues;
}
/**
 * 删除日记
 */
async function deleteDiaryInfos(id) {
    const result = await Diary.destroy({
        where: {
            id: id
        }
    });
    // result:删除的行数
    return result > 0;
}
// 更新日记查看记录
async function updateDiaryRecoord(diaryId) {
    const diaryDetail = await Diary.findOne({
        where: {
            id: diaryId
        },
        attributes: ["lookNums"],
    });
    const result = await Diary.update({
        lookNums: parseInt(diaryDetail.dataValues.lookNums || 0) + 1
    }, {
        where: { id: diaryId }
    });
    let boolean = result[0] > 0;
    return boolean //修改行数
}
/**
 * 编辑日记内容
 */
async function editDiaryInfos({ diaryId, pictures, content, title, auth }) {
    // 拼接要修改的用户信息
    let updateData = {};
    if (pictures) {
        updateData.pictures = pictures;
    }
    if (content) {
        updateData.content = content;
    }
    if (title) {
        updateData.title = title;
    }
    if (auth) {
        updateData.auth = auth;
    }
    const result = await Diary.update(updateData, {
        where: {
            id: diaryId
        }
    });
    let boolean = result[0] > 0;
    return boolean //修改行数
}
/**
 * 根据指定条件过滤日记
 */
async function filterDiaryList({ diaryId, userId, pageIndex = 0, pageSize = 10 }) {
    // 拼接查询条件
    let query = {};
    let diaryTributes = ["id", "userId", "title", "content", "pictures", "auth", "address", "lon", "lat", "lookNums"];
    if (userId) {
        query.userId = userId;
    }
    if (diaryId) {
        query.id = parseInt(diaryId);
    }
    // 根据传入条件查询博客列表
    let diaryList = await Diary.findAndCountAll({
        limit: pageSize * 1,
        offset: pageIndex * 1,
        order: [["lookNums", "desc"]],
        where: query,
        attributes: diaryTributes
    });
    diaryList = diaryList.rows.map(item => {
        return item.dataValues;
    });
    // 添加用户人员信息
    for (let i = 0; i < diaryList.length; i++) {
        let item = diaryList[i];
        // 根据用户ID查询用户信息
        let userInfos = await User.findOne({
            where: {
                id: item.userId
            },
            attributes: ["userName", "nickName", "picture", "id", "gender"],
        });
        item.userInfos = userInfos.dataValues;
    }
    return {
        diaryList,
        count: diaryList.count || 0
    }
}
module.exports = {
    createDiary,
    deleteDiaryInfos,
    editDiaryInfos,
    updateDiaryRecoord,
    filterDiaryList
}