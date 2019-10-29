/*

1.RN的富文本编辑的问题
在RN写邮件的正文，原本是h5的html好做，RN是获取不了html的，得转换提交和显示

2.RN富文本编辑器：react-native-zss-rich-text-editor
1）import { RichTextEditor } from 'react-native-zss-rich-text-editor'
public richtextRef = React.createRef()
<RichTextEditor
    ref={this.richtextRef}
    initialTitleHTML={'Title!!'}
    initialContentHTML={'Hello <b>World</b> <p>this is a new paragraph</p> <p>this is another new paragraph</p>'}
    editorInitializedCallback={() => this.onEditorInitialized()}
/>
2）在android/app/build.gradle最下面加：
project.afterEvaluate {
    apply from: '../../node_modules/react-native-zss-rich-text-editor/htmlCopy.gradle';
    copyEditorHtmlToAppAssets(file('../../node_modules/react-native-zss-rich-text-editor'))
}
3）RCTWebViewBridge的报错：
参考：https://github.com/wix/react-native-zss-rich-text-editor/issues/15

要装：react-native-webview-bridge

3.解决坑：https://www.jianshu.com/p/037e9a9c619a

*/