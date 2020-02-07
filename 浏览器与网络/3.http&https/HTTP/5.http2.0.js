/*
参考：https://github.com/ljianshu/Blog/issues/57
HTTP2: 基于SPDY协议，解决了http1.x的各种缺点

* 1.二进制传输：传输数据量的大幅减少，主要由于以二进制方式传输和Header压缩
HTTP1.x：头信息肯定是文本，数据体可以是文本，也可以是二进制。
HTTP2：头信息和数据体都是二进制，解析起来更高效。用"HEADERS"帧存放头数据、"DATA"帧存放实体数据。
帧：代表着最小的数据单位，每个帧会标识出该帧属于哪个流，流也就是多个帧组成的数据流(1个数据流=1次请求)

* 2.多路复用
    1）同域名下所有通信只需要在一个TCP链接上完成，可以承载任意数量的双向数据流并且互不影响。
    2）数据流以消息的形式发送，而消息又由一个或多个帧组成，多个帧之间可以乱序发送，因为根据帧首部的流标识可以重新组装。
优点：
    * 1）可以控制各个请求优先级，优先级高的服务端优先处理
    * 2）降低了延迟同时提高了带宽的利用率,避免了队头堵塞

* 3.头部压缩
   在客户端和服务器两端建立“字典”，用索引号表示重复的字符串，采用哈夫曼编码来压缩整数和字符串。
   就是客户端和服务器端把每次请求基本不变的头部用字符串存起来，然后只发送差异的数据，接收的时候再接上相同的字符串。可以减少冗余数据，降低开销

* 4.server push
    在多路复用的双向数据流中前端可以发请求，服务端也可以主动推送。比如首屏时候前端在请求后端的html的时候，服务端可以主动把html和其他的css、js推送到前端，不用在等前端加载js、css了。
注意：客户端也有权利选择是否接收。如果服务端推送的资源已经被浏览器缓存过，浏览器可以通过发送RST_STREAM帧来拒收。主动推送也遵守同源策略，换句话说，服务器不能随便将第三方资源推送给客户端，而必须是经过双方确认才行。

* 5.提高安全性
HTTP2可以是不加密的，但主流的浏览器都公开宣布只支持加密的HTTP/2，市面上通常所能见到的HTTP2都是使用"https”协议名，跑在TLS上面。HTTP/2协议定义了两个字符串标识符：“h2"表示加密的HTTP/2，“h2c”表示明文的HTTP/2。

*/