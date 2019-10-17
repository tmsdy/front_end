/*

1.React-Native Webview 和H5交互的两种方式: https://www.jianshu.com/p/44365ec64e4a
1）RN Webview 向H5注入JS
2）Webview 和 H5 相互发送监听消息（postMessage）
RN发送：在WebView组件上加
onLoadEnd={() => {
    this.refs.webView.postMessage('RN向H5发送的消息');
}}
H5监听：
window.onload = function() {
     document.addEventListener('message', function(msg) {
       console.log(msg)
       message = msg.data;
   });
}
H5发送：window.postMessage('网页向rn发送的消息');只能传string
RN接收：onMessage={(event) => {console.log(event.nativeEvent.data);}}

2.react-native-webview的5.x.x版本以上，h5的window.postMessage无效，^4.1.6也无效。
要用：window.ReactNativeWebView.postMessage(data)
https://xbuba.com/questions/41160221

*/