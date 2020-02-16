/*
参考：https://github.com/ljianshu/Blog/issues/23
Cache-Control： 浏览器优先使用Cache-Control(http1.1开始用)
    no-cache: 走协商缓存
    public(默认)：客户端和cdn代理服务器都可以缓存
    private：只能给浏览器缓存
    no-store：强缓存协商缓存都不走，只准请求
    max-age = 3600,3600s内不需请求浏览器无需发出请求，直接使用本地缓存(服务端配置)
    s-maxage：只在cdn代理服务器中生效

* 1.强缓存Cache-Control：max-age=3600s，基本不变的文件用，只有当名字变了才去请求。
根据本地缓存资源的 header 中Cache-Control的max-age判断有没有过期，没过期就走缓存。过期后走协商缓存。

* 2.协商缓存：适合常变动的文件用。协商缓存需要配合强缓存使用，没强缓存本地没缓存无从协商。
Etag：资源的实体标识（哈希字符串）
    与第一次请求返回给浏览器的if-none-match对应，当资源内容更新时，Etag会改变。
    服务器会判断Etag和if-none-match是否一致(类似指纹精准匹配)，如果不一致返回新资源，否则返回304直接读缓存。

last-modified缺点：
   1.某些服务端不能获取精确的修改时间
   2.如果在本地打开缓存文件，就会造成 Last-Modified 被修改，所以在 HTTP / 1.1 出现了 ETag 。

首次进页面：先看浏览器中有没有缓存，没有就去请求服务器，服务器在响应头写缓存策略的头
以后再进：判断缓存有没有过期，没有直接读缓存(强缓存)。过期就优先比对ETag再比对Last-Modified看有没过期
    没有返回304表示资源未更新，可使用本地的缓存，有的话就返回200，新数据和新的缓存标识

* 1.第一次请求服务器会返回last-Modified和Etag，再次请求该资源时会带上对应的if-modified-since、if-none-match



*/