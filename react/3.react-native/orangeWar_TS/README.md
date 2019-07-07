# RN 橙战 项目

### 代码规范
- 使用Sublime, Atom 开发, 请安装 editorconfig 插件
- 文件名使用首字母大写的驼峰式, 特例: 页面入口文件名统一为 index.js
- 目录使用首字母小写的驼峰式, 特例: 页面入口目录使用首字母大写的驼峰式
- 方法名使用首字母小写的驼峰式, 如: onPressed
- 样式名使用首字母小写的驼峰式, 如: btnText
- 变量使用首字母小写的驼峰式, 如: pageIndex
- 常量使用全大写的的下划线连接式, 如: PAGE_SIZE
- 所有静态资源都放在 src/assets/ 中
- 静态资源文件采用全小写的下划线连词式, 2倍图作为默认图, 3倍图加@3x后缀, 如: search_cross.png search_cross@3x.png
- js中的字符串使用单引号封装
- jsx中的属性值如果是字符串使用双引号封装
- 使用箭头函数代替function定义函数, no self! no that! no bind!
- 使用let或const代替var定义变量
- 尽量使用无状态组件, 无状态组件使用箭头函数代替class定义
- 一个文件内最多只定义一个组件
- 使用es6语法做模块的导入导出(import, export, export default)
- 模块依赖(import)顺序: react, react-native, iQiYi框架模块, 项目内公共模块, 页面内模块
- 类方法定义顺序: constructor, 生命周期函数, render, 业务方法
- 使用良好的封装扩展而不是条件判断来处理跨平台支持
- try...catch语句中使用 console.warn 代替 console.error 打印错误信息
- ref 使用规范
  - ref 实例均使用 **ReduxUtil.createRef()** 创建
  - ref 实例名称以 **ref/refs** 开头, 如:
  
	```
	this.refMoreMenu = React.createRef(); // 创建单个ref实例
	this.refsBanner = {} or []; // 创建一组ref实例
	```
  - ref 在组件上的定义遵循如下规则:
  
	```
	/* 定义单个 ref */
	<MoreMenu ref={this.refMoreMenu}/>
	/* 定义一组 ref 中的一项 */
	<Item ref={this.refsBanner[key] || (this.refsBanner[key] = React.createRef())}/>
	```

### 项目结构

```
.
├── commands // 一些辅助开发的脚本
├── mocks // mock数据
├── src
│   ├── container // 业务代码, 按频道划分
│   │   ├── demoPage // 展示demo页面
│   ├── common
│   │   ├── Global.js // 全局设置和常亮
│   │   ├── QYRequest.js // 数据请求公用类
|   ├── constants // 常量配置
|   ├── actions // redux actions 选择性使用
|   ├── reducers // redux reducers 选择性使用
|   ├── store // redux store 选择性使用
│   ├── Router.js // 路由映射
│   └── index.js // 主入口页
├── mock.config.js // mock映射配置
├── index.ios.js // ios入口
├── index.android.js // android入口
├── package.json // 依赖包配置/脚本配置
└── Readme.md // 项目介绍

```

### 常用命令
```
# 启动本地RN服务
npm start

# 代码质量检查
npm run lint

# 构建 IOS bundle, 并在ios项目中创建 commit
npm run ibuild

# 构建 Android bundle, 并在android项目中创建 commit
npm run abuild

# 执行 adb reverse tcp:8081 tcp:8081
npm run atcp


# 启动一个本地mock服务
npm run mockserver
```
