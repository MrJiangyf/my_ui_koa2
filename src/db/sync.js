/**
 * 若数据库表还没构建，则执行此文件初始化model中涉及的表
 * */
const seq = require("./seq");

// 调用user、blog创建相应的表
const { Enums } = require("./model/index");

// 测试连接
seq.authenticate().then(() => {
    console.log("------------- sequelize连接成功 -------------");
}).catch(() => {
    console.log("------------- sequelize连接失败 -------------");
});

// 根据model自定创建表
// force：true表示当数据库有相应的数据模型（表），如：users的时候会无条件将users表删除
seq.sync({ force: true }).then(() => {
    console.log("------------- 数据库表初始化完毕 -------------");
    process.exit();
});


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
