/**
 * 测试登陆，注册功能
 */

const server = require("../server");

// 用来测试的用户信息
const userName =  `test_${Date.now()}`;
const password = `test_${Date.now()}`;
const testUser = {
    userName,
    password,
    nickName: userName,
    gender: 1
}


// 存储cookie
let COOKIE = "";


/**
 * 1. 注册接口相关功能测试：注册是否成功/是否能重复注册/查询用户名是否存在/json schema校验请求参数是否生效
 */
// 注册路由
test("注册一个用户，应该成功", async () => {
    const res = await server.post("/api/user/register").send(testUser);
    expect(res.body.code).toBe(200);
})

// 重复注册
test("重复注册用户，应该失败", async () => {
    const res = await server.post("/api/user/register").send(testUser);
    expect(res.body.code).not.toBe(200);
})

// 查询用户是否存在
test("查询注册的用户名，应该存在", async () => {
    const res = await server.post("/api/user/isExist").send({userName});
    console.log("-------查询注册的用户名，应该存在-----------", res.body)
    expect(res.body.code).not.toBe(200);
})

// json schema 检测
test("json schame 检测，非法的格式，注册应该失败", async () => {
    const res = await server.post("/api/user/register").send({
        userName: '111',
        password: "1",
        gender: "我不是数字"
    })
    expect(res.body.code).not.toBe(200);
})


/**
 * 2. 测试登陆相关功能：登陆是否有效/将登陆成功后的cookie获取到方便删除接口使用/删除用户是否成功
 */
// 登陆
test("登陆， 应该成功", async () => {
    const res = await server.post("/api/user/login").send({
        userName,
        password
    })
    expect(res.body.code).toBe(200);

    //获取 Cookie
    COOKIE = res.headers["set-cookie"].join(";")
});


/**
 * 修改用户信息, 用户密码接口
 */
test("修改用户信息，应该成功", async () => {
    const res = await server.patch("/api/user/changeInfo")
        .send({
            nickName: "test111",
            city: "test-city",
            picture: "/test.png",
        })
        .set("cookie", COOKIE);
    expect(res.body.code).toBe(200);
});

test("修改用户密码，应该成功", async () => {
    const res = await server.patch("/api/user/changePassword")
        .send({
            password,
            newPassword: `test_mima`
        })
        .set("cookie", COOKIE);
    expect(res.body.code).toBe(200);
});

// 删除
test("删除用户，应该成功", async () => {
    const res = await server.post("/api/user/delete").set("cookie", COOKIE);
    expect(res.body.code).toBe(200);
});


// 退出
test("退出登陆，应该成功", async () => {
    const res = await server.post("/api/user/logout")
        .set("cookie", COOKIE);
    expect(res.body.code).toBe(200);
});



