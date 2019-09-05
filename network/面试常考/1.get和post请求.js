/*

1.GET:
      1) 请求能缓存
      2）请求参数在url上，有长度限制并且相对不安全，会被浏览器保存历史纪录
      3）浏览器回退无害
      4）多用于无副作用，幂等的场景。

2.POST:
      1）请求不能缓存，除非手动设置
      2）参数放request body来传输更多的数据，相对安全。支持更多的编码类型且不对数据类型限制
      3）浏览器回退再次提交请求
      4）多用于有副作用，不幂等的场景，例如注册。

副作用：指对服务器上的资源做改变，搜索是无副作用的，注册是副作用的。
幂等：比如注册 10 个和 11 个帐号是不幂等的，对文章进行更改 10 次和 11 次是幂等的。
      因为前者是多了一个账号（资源），后者只是更新同一个资源。

进阶理解：
1.GET和POST本质上没有什么区别，get请求也能在body放参数，post也能在url加参数，只不过看起来不规范而已

2.一般像增删改这种操作用post，get访问没有成本，post可以增加访问的成本

3.发送数据包：网络好发一次两次包的时间差可以无视，网络差发两次包的TCP在验证数据包完整性上，有非常大的优点。
      1）GET产生一个TCP数据包(相对高效)
            浏览器会把http header和data一并发送出去，服务器响应200（返回数据）,GET只需要汽车跑一趟就把货送到了

      2）POST产生两个TCP数据
            浏览器先发送header，服务器响应100 continue，浏览器再发送data，服务器响应200 ok（返回数据）。
            POST得跑两趟，第一趟，先去和服务器打个招呼“嗨，我等下要送一批货来，你们打开门迎接我”，然后再回头把货送过去。





*/