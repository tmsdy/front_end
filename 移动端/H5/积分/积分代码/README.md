# node应用

## 代码规范
- 使用 VSCode 开发，请在根目录配置jsconfig.json
- 使用 webstorm 开发, 请在 preferences -> Languages&Frameworks -> JavaScript -> Webpack 中指定 webpack configuration files 为 dev.conf.js
- 所有要上传到cdn的静态资源都放在 src/res/ 中
- 所有要编译到本地的静态资源（图片要进行base64的）都放在 src/assets/ 中
- 静态资源文件采用全小写的中划线连词式, 2倍图加@2x后缀作为默认图, 3倍图加@3x后缀, 如: search_cross@2x.png, search_cross@3x.png
- 推荐less 内引用静态图片资源采用 background-image 形式，assets/img/ 内的资源 可以通过 '~Assets/...'路径引用，res/img/ 内的资源可通过 .mix-res-background-image【less函数】引用
- 方法名使用首字母小写的驼峰式, 如: onPressed
- 样式名使用短横线连接，尽量最长不超过3-4个单词，单词尽量采用全拼, 如: button-background-color
- 变量使用首字母小写的驼峰式, 如: pageIndex
- 常量使用全大写的的下划线连接式, 如: PAGE_SIZE
- js中的字符串使用单引号封装
- 推荐使用es6模板字符串编写动态html模板，多采用函数进行 表现-逻辑 分离
- 使用箭头函数代替function定义函数
- 使用let或const代替var定义变量，首推使用const，少使用let
- 使用es6语法做模块的导入导出(import, export, export default)

## 项目结构

```
.
├── _server                         // node server 服务器 && 前端资源配置、打包
│   ├── bin                         // 启动服务器
│   │── build                       // 前端打包配置
│   │    └── webpack                // webpack配置
│   ├── config                      // 前端运行环境配置
│   └── middleware                  // node 中间件
├── routes                          // 页面路由 & 视图
├── src
│   ├── assets                      // 前端静态资源（fonts文件、小于10kb的图片建议放在此文件夹内）
│   ├── common                      // 公共方法库
│   │   ├── utils                   // js工具集
│   │   ├── wxShare                 // 微信SDK
│   │   ├── iqiyiPlugin.js          // 由 iqiyi SDK 提供的接口封装的方法集
│   │   ├── pingback.js             // pingback 底层方法
│   │   └── request.js              // 基于 Zepto.ajax 封装的 promise 异步请求工具
│   ├── components                  // 前端组件库
│   ├── less                        // 公共样式
│   │   ├── base.less               // 基础通用样式库（推荐每个页面都默认引用）
│   │   ├── iqiyi.less              // 贴合基线UI的通用样式
│   │   └── publicPage.less         // 页面通用样式（针对integral h5项目）
│   ├── pages                       // 页面js文件
│   └── res 
│       ├── css                     // 外部css资源
│       ├── img                     // 要上传到cdn的资源（其中小于10kb的图片资源默认会通过base64引用，但不影响上传cdn，为避免污染cdn，建议小于10kb的图片放在 assets/img/ 内）
│       └── scripts                 // 外部js资源
├── Dockerfile                      // docker 配置文件
├── server.config.js                // node 服务器配置文件
├── _appbuild.hs                    // 生产和测试发布环境的打包配置文件
├── _syncCDN.sh                     // cdn 上传配置文件
└── Readme.md                       // 项目介绍
```

## 使用到的技术
- node + express
- webpack
- node-fetch
- pm2
- and more

## 用法

### 下载依赖

```shell
npm install
```

### 开发理念

#### server-side
每个页面在 `routes` 目录下开发 node server 端的业务逻辑，包括服务端渲染。

node 框架是 express，服务端模板引擎是 `ejs`

express view 的路径就配置在 `routes` 目录，可以用 `res.render('home/view', props)` 渲染页面。

``
#### client-side

每个页面在 `src` 目录下开发浏览器端的业务逻辑，新加页面在pages文件夹里面添加


### 配置server.config.js

`server.config.js` 是 node.js server 端的一些基本配置


### 启动开发环境

带 webpack-dev-middleware 的模式，该模式不会真正生成文件，而是放到内存里，编译速度较快

```shell
npm start
```

不带 webpack-dev-middleware 的模式，该模式会使用`server.config.js` 里 staticPath 配置目录下的文件

```shell
npm run start:prod
``` 

### 发布打包

```shell
npm run build
```

### 配置 webpack

webpack 配置在 build 目录下。

每个页面都要在 `webpack/entry.js` 里配置入口，其中 `vendor` 为大家的公共依赖，每个页面都需要配置个入口文件
