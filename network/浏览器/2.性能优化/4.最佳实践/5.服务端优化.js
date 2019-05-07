/*

1.Gzip压缩
从HTTP/1.1开始，web客户端就有了支持压缩的Accept-Encoding HTTP请求头。
    请求头：Accept-Encoding: gzip, deflate
    响应头：Content-Encoding: gzip

2.避免src属性为空，否则浏览器会向服务器发送另一个请求。
    <img src=””> / var img = new Image();img.src = “”;

3.配置ETags
    服务端：ETag: "10c24bc-4ab-457e1c1f"给资源打标记
    客户端：If-None-Match: "10c24bc-4ab-457e1c1f"，如果和服务端的匹配就返回304直接读缓存

4.使用CDN


*/