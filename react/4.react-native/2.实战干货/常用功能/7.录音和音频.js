// 参考：https://blog.csdn.net/qq_39910762/article/details/94015890
/*
1.使用RNFS.readDir(AudioUtils.DocumentDirectoryPath)可以读到录音文件的数据

2.fetch可以发送跨域的post请求

3.接入讯飞语音：https://www.npmjs.com/package/react-native-speech-iflytek
https://www.xfyun.cn/doc/asr/voicedictation/iOS-SDK.html
语音教程：https://www.aidaxue.com/course/courseDetail?id=235
注意：
    1）framework path的设置，比如framework在某libs目录下，路径到libs就行别把文件名也加上了
    2）Targets - Build Settings - Build Options -> enable bitcode设为no
    3）搜 initWithFormat 设置appid
    4) 记得ios/libs下的iflyMSC.framework不要替换不然页面崩溃,不替换报登录失败错误
    临时解决：https://github.com/zphhhhh/react-native-speech-iflytek/issues/36
    在：node_modules/react-native/third-party/glog-0.3.4/src/logging.cc下
注释这个inline void LogDestination::SetLogDestination所有代码，clean再run

*/