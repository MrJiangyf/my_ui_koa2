/**
 * 测试user模型是否正确
 */

const {User} = require("../../src/db/model/index");

test("User 模型的各个属性，符合预期？", () => {
    // build 会构建一个内存User实例，但是不会提交到数据库
    debugger
    const user = User.build({
        userName: "jiangyf",
        password: "123456",
        nickName: "江有福",
        gender: 1,
        picture: "/XXX.png",
        city: '北京'
    });
    // 验证各个属性
    expect(user.userName).toBe('jiangyf');
    expect(user.password).toBe('123456');
    expect(user.nickName).toBe('江有福');
    expect(user.gender).toBe(1); // 测试 gender 默认值
    expect(user.picture).toBe('/XXX.png');
    expect(user.city).toBe('北京');
})
