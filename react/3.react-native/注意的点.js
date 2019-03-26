/*

1.andriod物理返回键：点击进入详情页后，按物理返回键会跳出app，需要处理
    装个安卓模拟器： emulator -avd a81或者andriod studio
    用到RN的 BackHandler

2.npm i react-native-easy-toast --save,老师写的RN toast组件有空可以看看咋做的

3.Webview的坑
    1）现在要在react-native-webview里面引了
    2）报错：在UIManager中找不到“RNCWebView”
        解决办法：react-native link react-native-webview
    3）Webview要放在外层,或者用Fragment包起来

4.需要安装fsevents这个包，有空了解下这个
    

*/