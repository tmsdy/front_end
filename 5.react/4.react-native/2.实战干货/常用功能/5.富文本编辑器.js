/*

1.RN的富文本编辑的问题
在RN写邮件的正文，原本是h5的html好做，RN是获取不了html的，得转换提交和显示

2.RN富文本编辑器：react-native-zss-rich-text-editor
1）import { RichTextEditor } from 'react-native-zss-rich-text-editor'
...
2）在android/app/build.gradle最下面加：
project.afterEvaluate {
    apply from: '../../node_modules/react-native-zss-rich-text-editor/htmlCopy.gradle';
    copyEditorHtmlToAppAssets(file('../../node_modules/react-native-zss-rich-text-editor'))
}
3）RCTWebViewBridge的报错：
参考：https://github.com/wix/react-native-zss-rich-text-editor/issues/15

要装：react-native-webview-bridge-updated

* ios: 手动link react-native-webview-bridge-updated 这里面的.a文件就行了

3.解决坑：https://www.jianshu.com/p/037e9a9c619a

4.sethtml后编辑内容后滚问题：
https://github.com/wix/react-native-zss-rich-text-editor/issues/109
解决：直接加contentInset={{ bottom: -2000 }}，下面会有固定空白这个，其他还没问题可以的。
解决2: 直接去源码里把window.scrollTo注释掉。


*/