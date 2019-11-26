/*

1.webpack方面：
    1）资源文件：打包压缩 + gzip压缩 + 抽离第三方库外链引入
    2）import语法可以动态引入路由

2.网络：
    1）开启http2: 多路复用+压缩请求头大大减少请求时间，
    2）dns预解析：预先获得域名所对应的 IP
        <link rel="dns-prefetch" href="//yuchengkai.cn">
    3）cdn：将基本不变的静态资源放到cdn上以外链的形式引入，较多时候多加几个域名。
    4）gzip压缩

3.缓存：强缓存和协商缓存，webpack给打包出来的文件固定的hash值

* 加载方面：
1）预加载：在浏览器空闲时间(first contentful paint后)开始加载别的页面必要的文件，优先级是lowest的
<link rel="prefetch" href="<%= publicPath %>/static/UEditor/ueditor.all.js" />
2）懒加载：请求到图片列表的地址，没在页面上显示的图片src=""，当快进入可视区再赋值src
3）

*/