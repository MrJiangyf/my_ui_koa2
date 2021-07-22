1. 上传文件所需依赖：

   ```javascript
   // 1.处理上传文件格式, 可通过 ctx.req.files["files"]可访问的中间件
   cnpm i formidable-upload-koa
   
   // 2.操作文件：删除，移动
   cnpm i fs-extra --save
   ```

2. 在app.js中配置uploadFiles目录为静态资源目录，这样就可以通过："服务器/文件名"访问到文件

   ```javascript
   const path = require("path");
   const koaStatic = require("koa-static");
   
   app.use(koaStatic(path.join(__dirname, "..", "uploadFiles")));
   ```

3. 编写路由（router）：/api/utils/upload 上传接口

   ```javascript
   const router = require('koa-router')();
   const { loginCheck } = require("../../middlewares/loginChecks");
   const koaFrom = require("formidable-upload-koa");
   
   const { saveFile } = require("../../controller/untils");
   
   router.prefix("/api/utils");
   
   //上传图片，借助koafrom中间件处理上传文件格式
   router.post("/upload", loginCheck, koaFrom(), async (ctx, next) => {
       const file = ctx.req.files["file"];
       const {size, path, name, type} = file;
       ctx.body = await saveFile({
           name,
           type,
           size,
           filePath: path
       })
   });
   
   module.exports = router;
   ```

4. 编写控制层（Controller）: 将上传文件存放到指定目录uploadFiles中，对上传文件进行文件大小控制，返回上传文件在服务器上的静态路径到前端。

   ```javascript
   const {ErrorModel, SuccessModel} = require("../model/ResModel");
   const path = require("path");
   
   const fse = require("fs-extra");
   
   //文件最大体积 1M
   const MIX_SIZE = 1024 * 1024 * 1024;
   //文件存储目录
   const DIST_SAVE_PATH = path.join(__dirname, "..", "..", "uploadFiles");
   //判断uploadFiles目录是否存在，不存在就创建
   fse.pathExists(DIST_SAVE_PATH).then(exist => {
       if (!exist) {
           fse.ensureDir(DIST_SAVE_PATH);
       }
   })
   
   
   /**
    * 保存文件
    * @param name 文件名
    * @param type 文件类型
    * @param size 文件体积
    * @param filePath 文件所在路径
    * @returns {Promise<void>}
    */
   async function saveFile({name, type, size, filePath}) {
       if (size > MIX_SIZE) {
           await fse.remove(filePath);
           return new ErrorModel({
               data: "",
               msg: "文件过大，不能超过1"
           })
       }
   
       // 移动上传文件到指定目录存储
       const fileName = Date.now() + "_" + name; //防止重名
       const distFilePath = path.join(DIST_SAVE_PATH, fileName);
       await fse.move(filePath, distFilePath);
   
       // 返回信息（在app.js中配置uploadFiles目录为静态资源目录，这样就可以通过："/文件名"访问到文件）
       return new SuccessModel({
           data: {url: "/" + fileName},
           msg: "上传成功"
       });
   
   }
   
   module.exports = {
       saveFile
   }
   
   ```
   
5. 什么是统一文件服务：当系统做成集群的时候文件上传到不同服务器的时候会导致资源无法共用。

   * 这时候就可以通过类似 `云服务，文件服务，CDN` 的去管理。
   * 在saveFile，处理上传文件存放位置的时候调用云服务接口存放资源。