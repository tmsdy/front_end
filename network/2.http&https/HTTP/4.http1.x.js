/*

HTTP1.0:
	每个TCP连接只能发送一个请求。

HTTP1.1:
1.长链接(持久连接)：connection:keep-alive，http1.1版本中默认所有的连接都是持久连接。减少了 TCP 连接的重复建立和断开所造成的额外开销。

请求1->响应1 -> 请求2->响应2 -> 请求3->响应3

2.管线化：在长链接的基础上，同一个TCP连接里可以同时并行发送多个请求，但是服务器还是要按照请求的顺序进行响应，要是前面的回应特别慢，后面就会有许多请求排队等着,会造成“队头阻塞”。GET和HEAD请求可以进行管线化，而POST则有所限制

请求1->请求2->请求3 -> 响应1->响应2->响应3

HTTP1.x的缺点：安全不足和性能不高。

新增功能:
    断点续传
    身份认证
    状态管理
    cache 缓存：Cache-Control、Expires、Last-Modified、Etag

*/