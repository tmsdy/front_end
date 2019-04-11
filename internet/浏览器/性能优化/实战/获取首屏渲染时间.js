/*
精确并自动化的获取页面首屏时间：https://juejin.im/post/5a9d108351882555867ee3cf

1.一般用手动埋点方式计算首屏时间
    缺点：1.和业务代码混用 2.覆盖不完整 3.准确性不一定高

2.首屏时间：

有图片：首屏时间 = 首屏图片全部加载完毕的时刻 - window.performance.timing.navigationStart
没有图片：首屏时间 = 页面处于稳定状态前最后一次 dom 变化的时刻 - window.performance.timing.navigationStart

*/