
console.log(arguments) //闭包的五个参数 exports require module __filename __dirname

/*
模块化(闭包实现)好处：
  低耦合 高内聚，方便维护，防止代码冲突

浏览器端的模块化：CMD(seaJs 就近依赖) AMD(requireJs) 依赖前置

node基于规范CommonJs 文件的读写，node天生自带模块化
  创建模块：一个js文件就是一个模块
  使用模块：require 文件
  导出模块：exports 、 module.exports

  

*/