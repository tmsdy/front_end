/*

1.DNS预解析
  一个从未访问过的域名解析耗时长达 1 秒，有缓存的话就很快
DNS预解析: 会分析这个页面需要的资源所在的域名，浏览器空闲时提前将这些域名转化为 IP 地址
<meta http-equiv='x-dns-prefetch-control' content='on'>
<link rel='dns-prefetch' href='http://g-ecx.images-amazon.com'>

2.开启http2: 多路复用，只需开一个TCP链接然后请求都走这一个链接，并行请求节约大量时间。

3.CDN提供静态资源

4.启用GZIP压缩(重要)：请求头上加上accept-encoding:gzip，让服务端做压缩，浏览器解压缩

5.分域存放资源：浏览器同一域名并行下载数有限，利用多域名主机存放静态资源来保证并行下载

6.减少页面重定向，页面重定向非常昂贵，根据W3C的标准，当页面发生重定向的时候，页面所有的
TCP链接必须重新建立
解决：主要后端处理，用Rewrite。还有SPA也能一定程度减少页面重定向


*/