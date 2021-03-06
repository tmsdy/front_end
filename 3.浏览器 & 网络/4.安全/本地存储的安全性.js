/*

1.攻击者也可以简单的使用localStorage.removeItem(key)和localStorage.clear()对存储数据进行清空。

2.建议不要使用localStorage方式存储敏感信息

3.本着一切输入输出都是有害的原则，要对数据进行严格的输入输出过滤。
在通过在localStorage存储中写入或读取数据的时候，那么极易可能这些数据被作为HTML代码进行解析，从而产生XSS攻击。

4.容易遭受跨目录攻击
localStroage存储方式不会像Cookie存储一样可以指定域中的路径，在localStroage存储方式中没有域路径的概念。
也就是说，如果一个域下的任意路径存在XSS漏洞，整个域下存储的数据，在知道存储名称的情况下，都可以被获取到

5.容易遭受DNS欺骗攻击

*/