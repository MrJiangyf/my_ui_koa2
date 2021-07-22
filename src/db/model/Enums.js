/**
 * @description 枚举表
 */

const seq = require("../seq");
const { INTEGER, STRING, TEXT } = require("../types");

const Enums = seq.define("enums", {
    code: {
        type: STRING,
        allowNull: false,
        comment: "枚举值"
    },
    label: {
        type: TEXT,
        allowNull: false,
        comment: "枚举名"
    },
});

module.exports = {
    Enums
}
