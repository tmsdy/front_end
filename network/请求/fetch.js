/*

1.可以在RN中全局使用fetch,fetch可以媲美XMLHttpRequest

2.注意点：
    1）fetch仅当网络故障或请求被阻止时，才会标记为reject，就算发回错误的状态码返回的Promise还是
        标记为resolve
        所以一般在res中判断一下res.ok
    2）默认情况下，fetch不会从服务端发送和接收任何cookies，如果站点依赖于用户session，则会导致
        未经认证的请求（要发送cookies,必须设置credentials选项）

3.fetch可以替代XMLHttpRequest，可以很容易地被其他技术使用，例如 Service Workers
    fetch还提供了单个逻辑位置来定义其他HTTP相关概念，例如CORS和HTTP的扩展

4.fetch特点：https://www.cnblogs.com/wonyun/p/fetch_polyfill_timeout_jsonp_cookie_progress.html
fetch不支持progress事件

*/