/**
 * 若数据库表还没构建，则执行此文件初始化model中涉及的表
 * */
const seq = require("./seq");

// 调用user、blog创建相应的表
const { LabelEnums, TypeEnums } = require("./model/index");

// 测试连接
seq.authenticate().then(() => {
    console.log("------------- sequelize连接成功 -------------");
}).catch(() => {
    console.log("------------- sequelize连接失败 -------------");
});

// 初始化枚举表数据
let labelList = [
    {
        code: "01",
        label: "javaScript"
    },{
        code: '02',
        label: 'css'
    },
    {
        code: '03',
        label: 'vue'
    },{
        code: '04',
        label: 'react'
    },{
        code: '05',
        label: 'node'
    },{
        code: '06',
        label: 'typeScript'
    },{
        code: "07",
        label: "webpack"
    }
];
let typeList = [
    {
        code: "01",
        label: "培训文档"
    },{
        code: "02",
        label: "组件封装"
    },{
        code: "03",
        label: "知识分享"
    }

];
labelList.map(item => {
    LabelEnums.create(item);
});
typeList.map(item => {
    TypeEnums.create(item);
});

// 根据model自定创建表
// force：true表示当数据库有相应的数据模型（表），如：users的时候会无条件将users表删除
seq.sync({ force: false }).then(() => {
    console.log("------------- 数据库表初始化完毕 -------------");
    process.exit();
});
