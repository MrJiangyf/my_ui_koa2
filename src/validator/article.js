/**
 * @description blog 数据格式校验
 */

const validate = require('./_validate')

// 校验规则
const SCHEMA = {
    type: 'object',
    properties: {
        title: {
            type: "string",
            maxLength: 255
        },
        lookNums: {
            type: "number",
            maxLength: 9999
        },
    }
}

/**
 * 校验用户数据格式
 * @param {Object} data 用户数据
 */
function blogValidate(data = {}) {
    return validate(SCHEMA, data)
}

module.exports = blogValidate;
