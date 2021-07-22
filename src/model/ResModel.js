/**
 * @description res：处理api返回数据格式
 */


/**
 * 基础模块
 */
class BaseModel {
    constructor({code, data, msg}) {
       this.code = code;
       if(data) {
           this.data = data;
       }
       if(msg) {
           this.msg = msg;
       }
    }
}

/**
 * 成功的数据模型
 */
class SuccessModel extends BaseModel {
    constructor({code, data, msg}) {
        super({
            code: code ? code : 200,
            data,
            msg
        });
    }
}

/**
 * 失败的数据模型
 */
class ErrorModel extends BaseModel {
    constructor({code, data, msg}) {
        super({
            code,
            data,
            msg
        });
    }
}

module.exports = {
    SuccessModel,
    ErrorModel
}
