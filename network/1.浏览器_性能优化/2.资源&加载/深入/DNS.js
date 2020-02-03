/*

域名系统DNS: 是一个分布式数据库，功能是联系域名和ip地址。域名与ip的对应关系,可分为各种类型
    A: Address，域名指向的IP地址，一个域名可以有多个A记录。
    NS：Name Server，保存下一级域名信息的服务器地址
    MX：Mail eXchange，接受电子邮件的服务器地址
    CNAME：Canonical Name，返回另一个域名，令当前查询域名挑去该域名，多个域名->服务器的映射。
    PTR： Pointer Record，只用于ip地址查询域名

dns查询的过程
1.看浏览器缓存 域名-IP地址
2.看本地hosts文件 域名-IP地址
3.请求域名服务器来解析，网络配置中DNS服务器地址(本地的域名解析服务器LDNS)，这里承担了大部分的域名解析工作
4.最后找不到就递归查询，按根域服务器->顶级域名.cn->第二层域名->子域名的顺序找到IP地址

DNS的安全问题：
1.DNS/域名劫持
    在劫持的网络范围内拦截域名解析的请求，分析请求的域名，返回假的IP地址或者使请求失去响应。
    DNS劫持通过篡改DNS服务器上的数据返回给用户一个错误的查询结果来实现的

DNS优化：
1.DNS预解析：用户在请求某个链接之前，浏览器先尝试解析该链接的域名再将其进行缓存。这样真正请求的时候就不需要进行DNS解析
    1.在服务器中响应设置X-DNS-Prefetch-Control的值为on启动预解析
    2.HTML中，<meta http-equiv="x-dns-prefetch-control" content="on">
    3.对特定域名预解析<link rel=”dns-prefetch” href=”//fonts.googleapis.com”>

2.域名收敛
    建议将静态资源只放在一个域名下面，可以有效减少dns的请求


*/