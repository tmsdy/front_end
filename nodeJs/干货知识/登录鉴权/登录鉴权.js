/*

jwt:
登录 -> 服务端拿到账号密码去数据库比对，正确的话返回包含用户信息的加密的token返回给客户端
    -> 客户端拿到token存在本地,请求的时候放到请求头Authorization上面
    -> 服务端拿到token，解密




参考：
阮一峰：http://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html

*/