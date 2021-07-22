1. jest用途：

   * 单个功能或接口，给定输入，得到输出。看输出是否符合要求
   * 要手动编写测试用例代码，然后统一执行
   * 意义：能一次性执行所有单测，短时间内验证所有功能是否正常。

2. 使用jest：

   1. *.test.js文件

   2. 常用的断言（jest判断语句）

      ```javascript
      //1.判断获取的对象是否与预期对象相等
      expect(res.body).toEqual({
              title: "koa2 json"
      })
      
      //2.判断获取的字符，数字是否与预期内容相等
      expect(res.body.title).toBe("koa2 json");
      ```

   3. 如何获取接口数据

      ```javascript
      const request=require("supertest");
      const server=require("../src/app").callback();
      
      const res = await server.get("/json");
      ```

      

3. 安装依赖：

   ```javascript
   cnpm i jest --save-dev
   cnpm i supertest --save-dev
   ```

4. package.json中配置测试用例启动脚本

   ```json
    "scripts": {
       "test": "node_modules/.bin/cross-env NODE_ENV=test jest --runInBand --forceExit --colors"
     },
   ```

   

