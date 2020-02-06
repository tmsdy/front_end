/* 参考：https://juejin.im/post/5abca877f265da238155b6bc

*1.js调用native方法: 注入API 和 拦截 URL SCHEME。
*注入API:通过 WebView 提供的接口，向js的 Context（window）中注入对象或者方法，让 js 调用时，直接执行相应的 Native 代码逻辑，达到 js 调用 native 的目的。
对于 iOS 的 UIWebView：
JSContext *context = [uiWebView valueForKeyPath:@"documentView.webView.mainFrame.javaScriptContext"];

context[@"postBridgeMessage"] = ^(NSArray<NSArray *> *calls) {
    // Native 逻辑
};
js调用：window.postBridgeMessage(message);



*/