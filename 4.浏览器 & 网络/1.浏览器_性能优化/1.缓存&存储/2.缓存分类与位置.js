/*
Webkit资源
主资源：比如HTML页面，或者下载项
派生资源：HTML页面中内嵌的图片、js/css

* 1.缓存位置及优先级： Service Worker > Memory Cache > Disk Cache > Push Cache
    * 1）Service Worker：让JS 运行在主线程之外，脱离了浏览器的窗体无法直接访问DOM，但可以做很多事比如离线缓存、消息推送和网络代理等功能。也是PWA 的重要实现机制。

    * 2）Memory Cache：内存缓存，效率快存活时间短(浏览器关闭就没了)，主要存js、字体、图片为主，常变化较小的资源

    * 3）Disk Cache：硬盘缓存，存储容量大存活时间长(浏览器关闭不会被清除,像localStorage)，主要存比较大的JS、CSS文件。如果内存使用率很高，资源会优先放磁盘。

    * 4）Push Cache：推送缓存，这是浏览器缓存的最后一道防线。http2的内容，暂时还不常用。

*/