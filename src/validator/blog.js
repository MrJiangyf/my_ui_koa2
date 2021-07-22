/**
 * @description blog 数据格式校验
 * @author 双越老师
 */

const validate = require('./_validate')

// 校验规则
const SCHEMA = {
    type: 'object',
    properties: {
       content: {
           type: "string"
       },
        image: {
           type: "string",
            maxLength: 255
        }
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
