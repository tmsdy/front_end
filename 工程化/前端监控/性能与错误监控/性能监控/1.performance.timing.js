
/*
performance.timing的各项

页面进来之前：
1.navigationStart : 前一个网页卸载的时间，默认fetchStart

2.前一个网页unload事件（要关网页的时候），默认为0
uploadEventStart，uploadEventEnd

3.重定向：需要同域的，默认为0
redirectStart，redirectEnd

页面进来后：1-5后端相关，是优化空间最大的。
1.fetchStart（重要）: 开始请求网页

2.DNS查询：如果不需要查询，那么默认值就是fetchStart
domainLoopupStart，domainLoopupEnd

3.向服务器建立握手链接：如果不需要建立链接，那么默认值就是fetchStart
connectStart，connectEnd

4.安全握手：非https的没有，默认为0
secureConnectionStart，secureConnectionEnd

5.向服务器发送请求和服务器相应请求(一定有的过程)
requestStart，responseStart，responseEnd

6.
domLoading: 解析DOM开始，document.readState = loading
dominteractive: 解析DON结束，document.readState = interactive
DOMContentLoadedEventStart: ContentLoaded开始
DOMContentLoadedEventEnd: ContentLoaded结束
domComplete: 文档解析完成
loadEventStart: load事件发送前（window.onload）
loadEventEnd: load事件发送后

*/