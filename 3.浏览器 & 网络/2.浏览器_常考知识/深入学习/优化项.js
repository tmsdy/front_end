/*

1.预先加载：
    1）dns预解析：在link上加的rel="dns-prefetch"
    2）资源预加载：
    3）tcp预链接

2.提高加载速度
    1.dns预解析
    2.多个cdn域名，使用cdn(对象存储)
    3.合并请求：nginx模块合并，雪碧图
    4.加缓存：
    5.tcp调优
    6.资源大小：gzip，webp，image压缩，减少cookie大小（只用作标志用户状态不乱加cookie）
    7.缓存组件：keep-alive
    8.异步读取js（加defer）

*/