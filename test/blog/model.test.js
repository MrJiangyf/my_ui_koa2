/**
 * 测试blog模型是否正确
 */

const {Blog} = require("../../src/db/model/index");

test("blog 模型的各个属性，符合预期？", () => {
    // build 会构建一个内存User实例，但是不会提交到数据库
    const blog = Blog.build({
        userId: 1,
        content: "微博内容",
        image: "图片"
    });
    // 验证各个属性
    expect(blog.userId).toBe(1);
    expect(blog.content).toBe('微博内容');
    expect(blog.image).toBe('图片');
})
