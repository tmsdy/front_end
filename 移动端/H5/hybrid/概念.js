/*
1.webview像是native内部的一个组件

2.web和native之间通过jsbridge互相通信

3.我们要做的是用js构建jsbridge请求,native用相应的代码拦截并做校验，然后通知js的回调函数
let iframe = document.createElement('iframe')
iframe.src = "jsbridge://xxx?c=123"
document.body.appendChild(iframe)



*/