/*

1.web请求拦截：chrome.webRequest
文档：https://developer.chrome.com/extensions/webRequest
onBeforeRequest：在即将发生请求时触发
onBeforeSendHeaders：在将请求头发送到网络之前触发事件
问题：只要是在chrome上的请求都会被监听到

*/