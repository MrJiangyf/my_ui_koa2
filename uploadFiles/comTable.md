### 一、module、chunk、bundle的区别

* module：各个源码文件，能被import导入的文件，如：css样式文件、js文件、图片等。
* chunk：多模块合并成的，如：entry、import()、splitChunk。
* bundle：根据chunk进行打包，最终输出的文件。

1. 三者之间的关系图：左（module）、中（chunk）、右（bundle）

<img src="/Users/mr.jiang/Desktop/我的笔记/Typora相关图片/前端/module、chunk、bundle.png" style="zoom:33%;" />

###  二、webpack基本配置

* Loaders：由于**webpack只能处理javascript**，所以我们需要对一些非js文件处理成webpack能够处理的模块，比如sass文件

 #### 1.拆分配置和merge

1. 拆分配置：

   * webpack.common.js：公用用到的配置
     * loader：处理js的loader、处理css的loader、处理less的loader
     * entry：编译js文件入口
     * plugin：HtmlwebpackPlugin({template: "路径", filename: "index.html"})
   * Webpack.dev.js：开发环境的配置
     * 服务：devserver
     * loader：处理图片的loader
   * Webpack.pro.js：生产环境的配置
     * loader：处理图片的loader（当图片小的时候可以处理成base64编码形式，减少http请求

3. merge合并配置

   ```javascript
   // 将公共配置分别合并到Webpack.dev.js、Webpack.pro.js中
   const {merge} = require("webpack-merge");
   const webpackCommonConf = require("./webpack.common.js");
   
   module.exports = merge(webpackCommonConf, {
     mode: "dev",
     module: {
       rules: [
          {
             test: /\.js$/,
             loader: ['babel-loader'],
             include: srcPath,
             exclude: /node_modules/
          },
       ]
     }，
     plugins: []
   });
   ```



#### 2. 处理ES6：babel-loader

1. 在rules配置js的loader

   ```javascript
   module: {
       rules: [
          {
             test: /\.js$/,
             loader: ['babel-loader'],
             include: srcPath,
             exclude: /node_modules/
          },
       ]
     }，
   ```

2. 在根路径下新增：.babelrc文件

   ```javascript
   {
       "presets": ["@babel/preset-env"],
       "plugins": []
   }
   ```

#### 3.处理样式：['style-loader', 'css-loader', 'postcss-loader']

* 注意loader 的执行顺序是：从后往前

* postcss-loader：css浏览器兼容性

  * 需要在根目录下新建postcss.config.js文件

    ```javascript
    module.exports = {
        plugins: [require('autoprefixer')]
    }
    ```

  * 要安装：autoprefixer、postcss-loader

* css-loader：解析`import “./index.css”`方式引入的css，利用style-loader将解析后的css插入到页面style标签中。

  ```javascript
  module: {
      rules: [
        {
                  test: /\.css$/,
                  // loader 的执行顺序是：从后往前
                  loader: ['style-loader', 'css-loader', 'postcss-loader'] // 加了 postcss
              },
              {
                  test: /\.less$/,
                  // 增加 'less-loader' ，注意顺序
                  loader: ['style-loader', 'css-loader', 'less-loader']
              }
      ]
    }，
  ```



#### 4.处理图片：url-loader

1. 当图片较小的情况：可以将其打包成base64编码，减少http请求。

   ```javascript
     module: {
           rules: [
               // 图片: 考虑 base64 编码的情况，不需要发http请求，以base64编码渲染成图片。
               {
                   test: /\.(png|jpg|jpeg|gif)$/,
                   use: {
                       loader: 'url-loader',
                       options: {
                           // 小于 5kb 的图片用 base64 格式产出
                           // 否则，依然延用 file-loader 的形式，产出 url 格式
                           limit: 5 * 1024,
   
                           // 打包到 img 目录下
                           outputPath: '/img1/',
   
                           // 设置图片的 cdn 地址（也可以统一在外面的 output 中设置，那将作用于所有静态资源）
                           // publicPath: 'http://cdn.abc.com'
                       }
                   }
               },
           ]
       }
   ```



### 三、webpack高级配置

#### 1.如何配置多入口

1. 重新部署项目的时候，如何做到用户不清理缓存也能访问到最新的资源（没有改变的资源直接使用缓存，改变的资源重新加载）？

   * output打包生成的文件名加上hash，每次打包时文件内容变化时都会生成一个新的文件名。

     ```javascript
     output: {
             filename: 'index.[contentHash:8].js',  // 打包代码时，加上 hash  
     },
     ```

   * 此时html引用的是最新生成的 index文件。

1. entry：配置置多个入口

   ```javascript
   entry: {
           index: path.join(srcPath, 'index.js'),
           other: path.join(srcPath, 'other.js')
   },
   ```

2. output：要用动态名字`[name]` 去命名`打包入口文件`生成的文件名，防止重名。

   ```javascript
   output: {
           // filename: 'bundle.[contentHash:8].js',  // 打包代码时，加上 hash 戳
           filename: '[name].[contentHash:8].js', // name 即多入口时 entry 的 key
           path: distPath,
           // publicPath: 'http://cdn.abc.com'  // 修改所有静态文件 url 的前缀（如 cdn 域名），这里暂时用不到
       },
   ```

3. HtmlWebpackPlugin插件：根据**指定html模板**打包生成**相应的html文件**，并将webpack**打包后输出的所有脚本文件**自动添加到生成的html文件。

   ```javascript
    plugins: [
           // 多入口 - 生成 index.html
           new HtmlWebpackPlugin({
               template: path.join(srcPath, 'index.html'),
               filename: 'index.html',
               // chunks 表示该页面要引用哪些 chunk （即上面的 index 和 other），默认全部引用
               chunks: ['index']  // 只引用 index.js
           }),
           // 多入口 - 生成 other.html
           new HtmlWebpackPlugin({
               template: path.join(srcPath, 'other.html'),
               filename: 'other.html',
               chunks: ['other']  // 只引用 other.js
           })
       ]
   ```

4. 打包结果

   ![](/Users/mr.jiang/Desktop/我的笔记/Typora相关图片/前端/webpack多入口.png)





#### 2.抽离压缩css

* 目的：css原来用`style-loader` 的方式将css样式跟js打包在一起，导致css要等着跟js一起加载效率低下。

1. 抽离css、less

   ```javascript
   const MiniCssExtractPlugin = require('mini-css-extract-plugin')
   const TerserJSPlugin = require('terser-webpack-plugin')
   
   module: {
       rules: [
          // 抽离 css
               {
                   test: /\.css$/,
                   loader: [
                       MiniCssExtractPlugin.loader,  // 注意，这里不再用 style-loader
                       'css-loader',
                       'postcss-loader'
                   ]
               },
               // 抽离 less --> css
               {
                   test: /\.less$/,
                   loader: [
                       MiniCssExtractPlugin.loader,  // 注意，这里不再用 style-loader
                       'css-loader',
                       'less-loader',
                       'postcss-loader'
                   ]
               }
       ]
     }，
   ```

2. 配置抽离后css存放路径

   ```javascript
   plugins: [
       new CleanWebpackPlugin(), // 会默认清空 output.path 文件夹
   
       // 抽离 css 文件
       new MiniCssExtractPlugin({
         filename: 'css/main.[contentHash:8].css'
       })
   ],
   ```

3. 压缩抽离的css（去除注释、空格之类）

   ```javascript
    optimization: {
       // 压缩 css
       minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
   }
   ```



#### 3. splitChunks：抽离第三方依赖（node_modules）、公共代码

* 使用场景：
  * 优化首屏加载时间：项目初始化时需要加载的 js 文件，文件过大会导致首屏加载时间过长，因此可以将大文件进行拆分。
  * 提取公共代码模块，避免重复打包，减少打包生成的文件总体大小。
  * 多入口项目，避免其中某个项目中没用到的依赖跟随着抽离出来的第三方依赖包(vendor)一同被加载。
* 注意：最终的目的就是减少请求**资源的大小**和**请求次数**。因这两者是互相矛盾的，故要以项目实际的情况去使用SplitChunks插件。

1. 在webpack.pro.js配置分割代码块

   ```javascript
   {
      optimization: {
           // 分割代码块
           splitChunks: {
               cacheGroups: {
                   // 抽离第三方模块，防止首屏加载index.js之类的入口文件过久。
                   vendor: {
                       name: 'vendor', // chunk 名称
                       chunks: 'all', // 不管异步加载还是同步加载的第三方依赖都是提取打包到同一个vendor文件中。
                       priority: 1, // 权限值越大，优先抽离，重要！！！
                       test: /node_modules/,
                       minSize: 0, 
                       minChunks: 1 
                   },
                   // 抽离elementUi（避免index.html项目没用到，跟随者vendor包一起被加载）  
                   element: {
                       name: `element`,
                       chunks: 'all', 
                       test: /[\\/]element-ui[\\/]/,
                       priority: 2, // 权限要比vendor高，因此element会从node_modules中抽离出成单独的element文件。
                   },
                   // 抽离公共的模块，避免重复打包。
                   common: {
                       name: 'common', // chunk 名称
                       priority: 0, // 优先级
                       minSize: 0,  // 公共模块的大小限制
                       minChunks: 2  // 公共模块最少复用过几次
                   }
               }
      }
   }
   ```

2. HtmlWebpackPlugin插件中配置生成的html文件要使用的代码块（即：分割后的第三方依赖、公共代码块等）

   ```javascript
    plugins: [
           new HtmlWebpackPlugin({
               template: path.join(srcPath, 'index.html'),
               filename: 'index.html',
               // chunks：表示该入口页面要引用哪些 chunk，默认全部引用
               chunks: ['index', 'vendor', 'common'] 
           }),
           new HtmlWebpackPlugin({
               template: path.join(srcPath, 'other.html'),
               filename: 'other.html',
               // 由于other.html入口用到element-ui，因此在这个入口使用它，index.html中没用到element-ui,因此可以将其从vendor包中抽离出来，防止element-ui跟随着vender包被引入到index.html中。
               chunks: ['index', 'vendor', 'common'，"element"]  
           }),
       ]
   ```
   
3. 注意：

   * index.js中至少得引用到第三方依赖，打包才会抽离生成vender文件。

   * 抽离第三方依赖后，记得babel-loader要排除node_modules

     ```javascript
      module: {
             rules: [
                 {
                     test: /\.js$/,
                     loader: ['babel-loader'],
                     include: srcPath,
                     exclude: /node_modules/
                 }
             ]
         },
     ```

     

   * 根据splitChunks配置可知公共代码至少得复用两次，才会抽离公共代码到打包生成的common文件中。

     

#### 4.懒加载

* 语法：import("要加载的内容路径")

* 使用懒加载，打包的时候会单独产生相应的js文件。

  ```javascript
  setTimeout(() => {
    // 跟vue react异步加载组件一样
    import("./test-data.js").then(res => {
      console.log(res.default);
    })
  })
  ```

#### 5.处理JSX

1. 在.babelrc文件中配置

   ```javascript
   {
       "presets": ["@babel/preset-react"],  // 记得安装：preset-react
       "plugins": []
   }
   ```



#### 6.处理Vue

1. 配置vue-loader

   ```javascript
   module: {
     rules: [
       {
         test: /\.vue$/,
         loader: ["vue-loader"],
         include: srcPath
       }
     ]
   }
   ```



### 四、webpack性能优化-构建速度

注意：**构建速度是指启动、打包项目的速度**

* 优化：babel-loader
* IgnorePlugin
* noParse
* happyPack
* parallelUglifyPlugin
* 自动刷新
* 热更新
* DllPlugin

#### 1.优化babel-loader

* cacheDirectory：开启缓存，只要是es6代码没有修改的都不会再重新编译。

  ```javascript
  {
     test: /\.js$/,
     use: ["babel-loader?cacheDirectory"],  //开启缓存
     include： path.resolve(__dirname, "src"), 
  }
  ```



#### 2.热更新（不能用于生产环境）

* 自动刷新：整个网页全部刷新，速度慢，状态会丢失
* 热更新：新代码生效，网页不刷新，状态不丢失

1. 在webpack.dev.js中配置热更新

   ```javascript
   const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');
   
   {
      entry: {
        // index: path.join(srcPath, 'index.js'),
        index: [
          'webpack-dev-server/client?http://localhost:8080/',
          'webpack/hot/dev-server',
          path.join(srcPath, 'index.js')
        ]
      },
      plugins: [
         new HotModuleReplacementPlugin()
      ],
      devServer: {
         hot: true,
      }
   }
   ```

2. 在入口页index.js中指定要开启热更新的文件，如果不开启热更新的页面，默认是自动刷新。

   ```javascript
   if(module.hot) {
     // 注意：只有math.js文件中的内容修改，才会触发热更新，除此之外的文件都是自动刷新。
     module.hot.accept(["./math.js"], () => {
         console.log("热更新回调：文件math.js做了修改，触发热更新")；
     })
   }
   ```





#### 3.IgnorePlugin：忽略第三方包指定目录，让这些指定目录不要被打包进去。

* 场景1：使用moment（该库主要是对时间进行格式化，并且支持多个国家语言）。

  场景2：echarts地图引用的时候，如果只用了福建的数据，不应该把地图数据都打印。

1. 使用moment存在问题？

   * 虽然我设置了语言为中文，但是在打包的时候，是会将所有语言都打包进去的。这样就导致包很大，打包速度又慢

   ```javascript
   import moment from 'moment'
   
   //设置语言
   moment.locale('zh-cn');
   let r = moment().endOf('day').fromNow();
   console.log(r);
   ```

2. webpack中配置IgnorePlugin：实现只打包我们用到的语言。

   ```javascript
   let Webpack = require('webpack');
   
   {
     plugins:[
        //moment这个库中，如果引用了./locale/目录的内容，就忽略掉，不会打包进去
   	   new Webpack.IgnorePlugin(/\.\/locale/,/moment/),
     ]
   }
   ```

3. 使用时只手动引入需要的语言包

   ```javascript
   import moment from 'moment'
   
   //设置语言
   
   //手动引入所需要的语言包
   import 'moment/locale/zh-cn';
   
   moment.locale('zh-cn');
   
   let r = moment().endOf('day').fromNow();
   console.log(r);
   ```

   

#### 4.HappyPack 多进程打包项目，提高启动、打包项目的效率。

* js单线程，开启多进程打包
* 小项目一般不建议打开，会消耗更多资源，效率反而降低

1. 配置webpack：

   ```javascript
    const HappyPack = require('happypack');
     
     {
        module: {
             rules: [
                 // js
                 {
                     test: /\.js$/,
                     // 把对 .js 文件的处理转交给 id 为 babel 的 HappyPack 实例
                     use: ['happypack/loader?id=babel'],
                     include: srcPath
                 },
        },
        plugins: [
        // happyPack 开启多进程打包
            new HappyPack({
                 // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
                 id: 'babel',
                 // 如何处理 .js 文件，用法和 Loader 配置中一样
                 loaders: ['babel-loader?cacheDirectory']
            }),
        ]
     }
   ```

#### 5.DllPlugin动态链接库插件（不能用于生产环境）：抽离第三方依赖

* 前端框架：如vue、react，体积大，构建慢较稳定，不常升级版本的第三方依赖。
* 可以将稳定的第三方依赖单独打包出来，通过script标签将单独构建的包引入到index.html中。
* 这样启动项目的时候就不需要再去重新编译第三方依赖。

1. 创建webpack.dll.js，并配置DllPlugin：

   ```javascript
   const path = require('path')
   const DllPlugin = require('webpack/lib/DllPlugin')
   const { srcPath, distPath } = require('./paths')
   
   module.exports = {
     mode: 'development',
     // JS 执行入口文件
     entry: {
       // 1.把 React 相关模块的放到一个单独的动态链接库
       react: ['react', 'react-dom']
     },
     output: {
       // 2.输出的动态链接库的文件名称，[name] 代表当前动态链接库的名称，
       // 也就是 entry 中配置的 react 和 polyfill
       filename: '[name].dll.js',
       // 输出的文件都放到 dist 目录下
       path: distPath,
       // 3.存放动态链接库的全局变量名称，例如对应 react 来说就是 _dll_react，在前面加上 _dll_ 是为了防止全局变量冲突
       library: '_dll_[name]',
     },
     plugins: [
       // 4.接入 DllPlugin
       new DllPlugin({
         // 动态链接库的全局变量名称，需要和 output.library 中保持一致
         // 该字段的值也就是输出的 manifest.json 文件 中 name 字段的值
         // 例如 react.manifest.json 中就有 "name": "_dll_react"
         name: '_dll_[name]',
         // 描述动态链接库的 manifest.json 文件输出时的文件名称
         path: path.join(distPath, '[name].manifest.json'),
       }),
     ],
   }
   ```

2. 执行webpack.dll.js配置会在dist中生成两个文件夹

   ![](/Users/mr.jiang/Desktop/我的笔记/Typora相关图片/前端/dllPluging.png)

3. 在模板index.html中使用打包生成的react.dll.js：

   ```html
   <body>
       <div id="root"></div>
   
       <script src="./react.dll.js"></script>
   </body>
   </html>
   ```

   

   在webpack.dev.js中使用react.manifest.json：

   ```javascript
   {
      plugins: [
           // 第三，告诉 Webpack 使用了哪些动态链接库
           new DllReferencePlugin({
               // 描述 react 动态链接库的文件内容
               manifest: require(path.join(distPath, 'react.manifest.json')),
           }),
       ],
   }
   ```

4. 注意：在webpack.dev.js中使用babel-loader的时候的时候要排除node_modules文件夹内的东西，否则每次打包项目的时候又会将react、react-dom第三方依赖也打包进去。





### 五、webpack性能优化-产出代码

#### 1.要实现的结果

* 体积更小
* 合理分包，不重复加载
* 速度更快，内存使用更小

#### 2.如何优化

1. 小图片base64编码（如：一、4中的做法）

2. bundle加hash

   * 重新部署项目的时候，如何做到用户不清理缓存也能访问到最新的资源（没有改变的资源直接使用缓存，改变的资源重新加载）？

     * output打包生成的文件名加上hash，每次打包时文件内容变化时都会生成一个新的文件名。

       ```javascript
       output: {
               filename: 'index.[contentHash:8].js',  // 打包代码时，加上 hash  
       },
       ```

     * 此时html引用的是最新生成的 index文件。

3. 懒加载

4. 提取公共代码（如：二、3）

5. IngorePlugin：忽略第三方包指定目录，让这些指定目录不要被打包进去。

6. 使用CDN加速：将打包的文件部署到CDN加速服务器

   * output要配置静态资源文件url前缀指向部署的CDN地址

     ```javascript
     {
       output: {
             filename: 'index.[contentHash:8].js',  // 打包代码时，加上 hash  
             publicPath: "http://cdn.abc.com" // 修改静态资源文件url前缀指向部署的CDN地址
       },
     }
     ```

   * 设置图片的CDN地址

     ```javascript
     module: {
             rules: [
                 {
                     test: /\.(png|jpg|jpeg|gif)$/,
                     use: {
                         loader: 'url-loader',
                         options: {
                             limit: 5 * 1024,
                             outputPath: '/img1/',
     
                             // 设置图片的 cdn 地址（也可以统一在外面的 output 中设置，那将作用于所有静态资源）
                              publicPath: 'http://cdn.abc.com'
                         }
                     }
                 },
             ]
         }
     ```

7. 使用production

   * 自动开启代码压缩

   * Vue、React等会自动删掉调试代码（如：开发环境的warning）

   * 自动开启Tree-Shanking

     * 作用：没有被引用的代码（如：函数、变量）不进行打包。

       ```javascript
       export const sum = (a, b) => {
           return a + b
       }
       
       export const mult = (a, b) => {
           return a * b
       }
       
       // 函数mult没有被引用到，使用production打包的时候不会将其打包进去
       ```

       

     * 注意：Es6 module模块化语法才能让Tree-Shanking生效，commonjs模块化语法不能生效。

   1. webpack如何开启production

      ```javascript
      module.exports = smart(webpackCommonConf, {
          mode: 'production',
      })
      ```

      

8. 使用Scope Hosting

   * 代码体积更小
   * 创建函数作用域更小
   * 代码可读性更好

   1. 为何使用Scope Hosting创建函数作用域更小？

      * 文件`hello.js`

        ```javascript
        export default "Hello jiangyf";
        ```

      * 在`main.js`中引入hello.js中的字符串并打印

        ```javascript
        import str from "./hello.js";
        console.log(str);
        ```

      * 打包hello.js、main.js后的样子：

        <img src="/Users/mr.jiang/Desktop/我的笔记/Typora相关图片/前端/scope hosting.png" style="zoom:33%;" />

      * 使用scope Hosting，在进行打包的结果：

        <img src="/Users/mr.jiang/Desktop/我的笔记/Typora相关图片/前端/scope hosting1.png" style="zoom:25%;" />

      * 进过对比可知：使用scope Hosting，可以将个模块引用的内容最终打包成一个函数，降低内存的使用（定义一个函数会分配内存）、不需要跨作用域调用函数，提高效率。

   2. 如何开启scope Hosting

      ```javascript
      const ModuleConcatenationPlugin = require("webpack/lib/optimize/ModuleConcatenationPlugin");
      
      module.exports = {
        resolve: {
          // jsnext:main作用，优先采用第三方模块中指向的ES6模块化语法的文件。
          mainFields: ["jsnext:main", "browser", "main"]
        },
        plugins: [
          // 开启 Scope Hosting
          new ModuleConcatenationPlugin()
        ]
      }
      ```

      





​                               


































