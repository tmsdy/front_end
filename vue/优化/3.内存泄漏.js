/*

内存泄漏问题在单页应用中尤为重要，因为在 SPA 的设计中，用户使用它时是不需要刷新浏览器的,应用需要自行清理组件来确保垃圾回收以预期的方式生效。

内存泄漏在 Vue 应用中通常不是来自 Vue 自身的，更多地发生于把其它库集成到应用中的时候。

1.一个vue组件里的第三方实例在beforeDestroy钩子里面消除掉

2.想要保存状态可以用keep-alive 组件

引起内存泄漏的原因：
1. 全局变量引起的内存泄漏
2. 闭包引起的内存泄漏
3. dom清空或删除时，事件未清除导致的内存泄漏
4. 被遗忘的计时器或回调函数
实战分析：https://www.jianshu.com/p/a29909e389d8

*/