/*

1.减少页面重定向，页面重定向非常昂贵，根据W3C的标准，当页面发生重定向的时候，页面所有的
TCP链接必须重新建立
解决：主要后端处理，用Rewrite。还有SPA也能一定程度减少页面重定向

2.使用CDN，获取更低的延迟，这样也能减少CDN的开销

*/