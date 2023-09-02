/**
 * 若数据库表还没构建，则执行此文件初始化model中涉及的表
 * 执行node 当前文件.js构建项目所涉及所有表
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

// 根据model自定创建表
// force：true表示当数据库有相应的数据模型（表），如：users的时候会无条件将users表删除
seq.sync({ force: false }).then(() => {
    // 初始化枚举表数据
    initEnumTableData();
    async function initEnumTableData() {
        let labelList = [
            {
                code: "01",
                label: "javaScript"
            }, {
                code: '02',
                label: 'css'
            },
            {
                code: '03',
                label: 'vue'
            }, {
                code: '04',
                label: 'react'
            }, {
                code: '05',
                label: 'node'
            }, {
                code: '06',
                label: 'typeScript'
            }, {
                code: "07",
                label: "webpack"
            }, {
                code: "08",
                label: "原创"
            }, {
                code: "09",
                label: "转载"
            },
        ];
        let typeList = [
            {
                code: "01",
                label: "js基础"
            }, {
                code: "02",
                label: "css"
            }, {
                code: "03",
                label: "vue"
            }, {
                code: "04",
                label: "浏览器相关"
            }, {
                code: "05",
                label: "node"
            }, {
                code: "06",
                label: "webpack"
            }, {
                code: "07",
                label: "常见问题"
            }, {
                code: "08",
                label: "开发规范"
            }, {
                code: "09",
                label: "typeScript"
            }, {
                code: "10",
                label: "react"
            }

        ];
        let isInit = await LabelEnums.findOne({
            where: {
                label: labelList[0].label
            }
        });
        if (isInit) {
            // 如果已经初始化枚举数据，则关闭进程
            process.exit();
            return;
        }
        // 如果还没始化枚举数据，则先初始化在关闭线程（注意创建数据是异步，所以用await阻塞，不然会先执行process.exit()）
        for (let i = 0; i < labelList.length; i++) {
            let item = labelList[i];
            await LabelEnums.create(item);
        }
        for (let i = 0; i < typeList.length; i++) {
            let item = typeList[i];
            await TypeEnums.create(item);
        }
        process.exit();
    }
});

