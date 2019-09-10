/*

1.只用cookie的话来回传登录信息很危险

2.session: 生成u_id传递，用{}把保存session的话，访问量大内存会暴增
在32位系统中一个node进程限制最多1.6G的内存，上线的时候会多node进程来跑

3.进程之间的内存数据是不能共享的，登录验证解决方案：
1）session+redis
redis：
    缓存数据库(非关系型的)，数据存在内存中，相对mysql(硬盘数据库)访问速度快的多。多进程都能访问到同一个redis缓存数据库。缺点就是成本更高，可存储的数据量更小(内存的硬伤)
为什么session适合用redis？
    session访问频繁，对性能要求高，可不考虑断电丢失数据问题，不行就再登录一遍。session的数据量不会太大(相比于mysql中存储的数据)

2）jwt

4.起步和操作
安装：brew install redis 在项目中 npm i redis
起连接：redis-server然后开个窗口redis-cli
存：set name feifei
取：get name
查所有key：keys *
删除：del name


*/