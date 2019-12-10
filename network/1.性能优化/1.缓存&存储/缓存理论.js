/*
Webkit资源
主资源：比如HTML页面，或者下载项
派生资源：HTML页面中内嵌的图片、js/css

缓存的资源去哪里了?
1.memory cache:
  1）浏览器默认的缓存放在memory cache，浏览器关闭就清除了
  存储: js、字体、图片为主，会变化的资源

2.disk cache：
  1）响应头有Etag的资源会被放入disk cache，浏览器关闭不会被清除(像localStorage)
  存储：css为主，基本不会变化的资源

3.三级缓存原理 (访问缓存优先级)
先从内存中找，找不到再去硬盘中找，再找不到就网络请求，请求获取的资源再缓存到硬盘或内存中

4.
Service Worker Cache：Service Worker的
HTTP Cache：强缓存协商缓存的
Push Cache：http2服务端推送的

说法：Chrome会根据本地内存的使用率来决定缓存存放在哪，如果内存使用率很高，放在磁盘里面，内存的使用率很高会暂时放在内存里面。这就可以比较合理的解释了为什么同一个资源有时是from memory cache有时是from disk cache的问题了。

*/