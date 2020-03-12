/*

* 1.manifest.json：配置所有和插件相关的配置

2.content-scripts：可以配置向页面注入js和css(实战一般不这么干)，可以用来搞广告屏蔽、页面CSS定制。
  * 缺点：无法访问页面中的JS，DOM无法调用它(无法绑定事件)

* 3.background：后台页，看不到它的页面只能调试它的代码
  * 1）生命周期长随浏览器开而开关而关。
  * 2）权限很高，Chrome扩展API基本都能调用
  * 3）无限制跨域，像chrome-extension://id/xx.html打开的页面也可以无限制跨域
一般配置："background": { "page": "background.html" },也可以配置js让它不常驻优化一丢丢性能

* 4.popup：点击browser_action或pageAction打开的小窗口网页
  * 1）可以做些临时性交互，会自适应大小
  * 2）失焦点击就没了，生命周期短，需要常见运行的代码不要写在里面
  * 3）权限也很高，可以用chrome.extension.getBackgroundPage()获取background的window对象
一般配置如下
"browser_action": {
  "default_title": "竹蜻蜓",
  "default_popup": "popup.html",
  "default_icon": {
    "16": "img/Hopter16.png",
    ...
  }
},

* 5.injected-script：在DOMContentLoaded事件后，创建script标签，用chrome.extension.getURL('js/inject.js')这样来获取要注入的js的url，类似于chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js，然后放到页面执行就行，也可以执行完删掉。
但是会有报错，在web中直接访问插件中的资源的话必须显示声明才行
"web_accessible_resources": ["js/inject.js"],


*/