/**
 * @description 首页测试
 */

const server = require("../server");

const {COOKIE} = require("../testUserInfo");

let BLOG_ID = "";

test("创建一条博客， 应该成功", async () => {
    const content = `博客内容${Date.now()}`;
    const image = "我是图片";

    const res = await server
        .post("/api/blog/create")
        .send({content, image})
        .set("cookie", COOKIE);

    debugger

    expect(res.body.code).toBe(200);

    BLOG_ID = res.body.data.userId;

});
