/*
* 1.browserAction：插件图标旁的展示
"browser_action": {
    "default_title": "竹蜻蜓", // 鼠标悬浮的title
    "default_popup": "popup.html", // 点击展示的html
    "default_icon": { // 展示的图标，推荐使用宽高都为19像素的图片，更大的图标会被缩小，格式随意，一般推荐png
      "16": "img/Hopter16.png",
      ...
    }
  },
badge：在图标上显示一些文本，可以用来更新一些小的扩展状态提示信息。因为badge空间有限，所以只支持4个以下的字符（英文4个，中文2个），badge无法通过配置文件来指定，必须通过代码实现，设置badge文字和颜色可以分别使用setBadgeText()和setBadgeBackgroundColor()。
chrome.browserAction.setBadgeText({ text: 'New' });
chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });

* 2.pageAction：可以搞出只有当进入插件激活页插件才高亮显示的效果

* 3.右键菜单：
  * 1）可以自定义浏览器的右键菜单，通过chrome.contextMenus实现
  * 2）可以选中文字后右键指定用什么搜索
  * 3）可以添加、删除、更新等完全自定义右键菜单

* 4.override(覆盖特定页面)：可以把新的tab页、历史页、书签页替换成自己指定的页面

* 5.devtools(开发者工具)：可以自定义一个devtools里的panel，检测当前页面的代码、资源、网络请求等都可以

6.omnibox：向用户提供搜索建议的一种方式

* 7.桌面通知：chrome.notifications.create(null, { ... })

*/