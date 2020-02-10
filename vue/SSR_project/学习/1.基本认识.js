/*
* 1.SSR
    * 1）利于SEO：客户端渲染打包后的文件只有个id为app的div，爬虫爬不到关键信息。服务端渲染      是可以被爬虫抓取到的
    * 2）首屏快：SSR直接返回HTML字符串给浏览器，大大加快了首屏加载的时间
    * 缺点：
       1.会占用服务端更多的CPU和内存资源(请求量过大服务器压力大)
       2.像window的一些api无法正常使用
       3.vue中只支持beforeCreate和created两个生命周期


* 2.vue预渲染：一种解决SEO的较简单的方案，适用于没有动态数据的页面。

*/