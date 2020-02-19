/*

1.开发插件：在mypack下bin目录写脚本，在package.json配置bin，然后npm link，把本地项目链接到全局。
然后mypack就能用了。
"bin": {
    "mypack": "./bin/mypack.js"
},

2.装必要的工具：npm i tapable esprima escodegen estraverse ejs -S
tapable：事件钩子流
esprima：解析和生成ast语法树
estraverse：遍历ast语法树的
escodegen：生成代码的


 TODO 搞个自动上传静态资源到CDN上的插件

*/