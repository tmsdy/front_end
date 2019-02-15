 (function(modules) { 
 	var installedModules = {};//缓存模块，加载完放这里，以后就不需要加载了
	//实现了require方法
 	function __webpack_require__(moduleId) {

 		if(installedModules[moduleId]) { //再次require缓存模块已有的，直接返回
 			return installedModules[moduleId].exports;
		 }
		//  第一次require的会在installedModules初始定义一个
 		var module = installedModules[moduleId] = {
 			i: moduleId,
 			l: false,//是否加载完成
 			exports: {} //导出的东西
 		};
/*
	把传入的key value里面的匿名执行函数执行
	这里是先走index.js，然后__webpack_require__(\"./src/a.js\")引a.js，
	a.js原本module.exports为{}变为module.exports = 'hello feifei'
	然后let str = 'hello feifei'
*/
 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

 		module.l = true;

 		return module.exports;
 	}

 	return __webpack_require__(__webpack_require__.s = "./src/index.js"); //传入口模块
 })({
 "./src/a.js": //key -> 当前模块的路径，每个文件都是一个模块
 (function(module, exports) { // value 匿名执行函数
  eval("\r\nmodule.exports = 'hello feifei'\n\n//# sourceURL=webpack:///./src/a.js?");
 }),
 "./src/index.js":
 (function(module, exports, __webpack_require__) {
  eval("\r\nlet str = __webpack_require__(\"./src/a.js\")\r\n\r\nconsole.log(str)\n\n//# sourceURL=webpack:///./src/index.js?");
 })

 });