/*

1.工程服务化后，不同职责的服务分散在不同的工程中，往往这些工程的域名是不同的，但一个需求可能需要对应到多个服务，
    这时便需要调用不同服务的接口，因此会出现跨域。
例如：积分后端常规地址、测试环境的登录地址、卡券相关的地址都是请求不一样的域名

2.前端需要配host，把本地127.0.0.1映射成一个后端允许的域名，再去请求，把要请求的也指向到一个host直接去访问不用DNS解析

3.一般请求都是要带cookie的，后端一般都得设cors允许的请求，例如：
    Access-Control-Allow-Credentials: true
    Access-Control-Allow-Headers: content-type
    Access-Control-Allow-Methods: GET,POST,DELETE,PUT,OPTIONS
    Access-Control-Allow-Origin: http://test.h5.iqiyi.com:3333
    Access-Control-Max-Age: 86400

4.



*/