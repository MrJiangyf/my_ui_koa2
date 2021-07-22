/**
 * json test
 */

const server = require("./server");

//测试 “/string” 接口返回数据是否符合预期
test("string 接口返回数据格式正确吗", async () => {

    //1.get请求
    const res = await server.get("/string");

    expect(res.body.title).toBe("koa2 string");
});

