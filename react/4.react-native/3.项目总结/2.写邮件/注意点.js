/*
难点：
1.state有

1.输入内容：
用的富文本编辑器库，底层还是通过和webview通信做的
1）处理回复邮件html支持显隐，并且发送的时候需要去掉处理痕迹。
2）

2.接口返回的很多参数，都是可能会有也可能没有。都要if判断包个setState

3.多种情况跳到写邮件页面：state状态很多主组件有30多个，拆分了附件列表和自动联想

4.跳选择联系人和文档，选好再跳回来的话带上选中的
1）navigation.navigate: 再点返回又返回到选择页了
2）StackActions.reset：返回webview页不行
3）pop + replace: 原始邮件的编辑状态会丢掉

5.根据是否是新版本，决定是否跳转RN写邮件。
WebView可以塞入js脚本，injectedJavaScript={jsStr}，这样就可以给h5的window赋值了
window.postMessage(JSON.stringify({type: 'writeMail',params: {...}}))

6.收件人多了变多上面内容高度高了的时候，应该自动检测向下滚动

*/