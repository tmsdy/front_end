/*

能够完成整个 HTTP 请求+响应（尽管不需要响应内容）
触发 GET 请求之后不需要获取和处理数据、服务器也不需要发送数据
跨域友好
执行过程无阻塞
相比 XMLHttpRequest 对象发送 GET 请求，性能上更好
GIF的最低合法体积最小（最小的BMP文件需要74个字节，PNG需要67个字节，而合法的GIF，只需要43个字节）
不会阻塞页面加载，影响用户的体验，只要new Image对象就好了；（排除JS/CSS文件资源方式上报）



 */