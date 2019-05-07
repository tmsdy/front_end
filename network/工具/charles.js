/*

1.抓包之Charles For Mac 4.0+破解版：https://www.jianshu.com/p/1c1023036a75，没注册的charles,30分钟就会关闭一次。

2.mac os proxy勾上这样电脑上走的请求全都可以被抓到

3.抓https：Help -> SSL Proxying -> Install Charles Root Certificate，装ca证书
    要配好*:433的端口
    手机上用Help -> SSL Proxying -> 。。。。下载的证书，要在安全性和隐私里面安装，我的是在系统安全->加密与凭据
    我用的chrome浏览器。不要用小米手机自带的浏览器下载
    还是有抓包失败: SSLHandshake: Received fatal alert: certificate_unknown
    

4.过滤网络请求：Proxy -> Recording Setting -> include添加白名单

5.模拟限速网络：Proxy -> Throttle Settings

6.多次请求：sequence看到请求，右键有repeat，可以再次请求，repeat advanced可以多次请求

7.找到符合某条件的请求：右键左边的域名，选择find In


*/