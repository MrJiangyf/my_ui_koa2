const seq = require("./seq");

//调用user、blog创建相应的表
const {Enums} = require("./model/index");

//测试连接
seq.authenticate().then(() => {
    console.log("ok")
}).catch(() => {
    console.log("err");
})


// 初始化枚举表数据
Enums.create({
    code: '01',
    label: 'javaScript'
});
Enums.create({
    code: '02',
    label: 'vue'
});
Enums.create({
    code: '03',
    label: 'react'
});
Enums.create({
    code: '04',
    label: 'node'
});
Enums.create({
    code: '05',
    label: 'typeScript'
});

//执行同步
//force：true表示当数据库有相应的数据模型（表），如：users的时候会无条件将users表删除
seq.sync({force: false}).then(() => {
    console.log("sync ok");
    process.exit();
});
