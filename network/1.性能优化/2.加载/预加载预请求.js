/*

预加载（preload）- 请求优先级highest
一般浏览器会推测一些css作为highest优先级请求，不过也有没被推测出的但比较重要的，这时候可以用preload提高请求优先级。
<link rel="preload" href="late_discovered_thing.js" as="script">

预请求（prefetch）
浏览器的空闲时间去先下载用户指定需要的内容,然后缓存起来,这样用户下次加载时,就直接从缓存中取出来,效率就快了。
 提前下载好 user 模块的 js 资源，用户访问 /user 时就可以直接读缓存
<link href="/static/js/user.479d709b.js" rel="prefetch">

*/