/*

1.说是react-native-gesture-handler不存在
安卓 npm start -- --reset-cache清除缓存启动就好了
xcode清设备缓存：访达 -> 前往文件夹 -> ~/资源库/Developer/CoreSimulator/Devices
https://www.jianshu.com/p/702a14145898

2.cannot read property 'Direction' of undefined
https://www.jianshu.com/p/3c347bcf6da6

3.集成cocoapods的问题
Deployment target设置：https://blog.csdn.net/wulong710/article/details/53995181

4.编译出现_OBJC_CLASS_$_XX,粘贴文件要向xcode，不然可能没导入
https://www.jianshu.com/p/6d5283b7418d

5.xcode11中RN启动时报错：
Unknown argument type '__attribute__' in method -[RCTAppState getCurrentAppState:error:]. Extend RCTConvert to support this type.
解决：https://blog.csdn.net/askme_/article/details/101206086

6.启动报错多了可以product -> clean build folder试试

7.'React/RCTBridgeModule.h' file not found
解决：https://stackoverflow.com/questions/41663002/react-rctbridgemodule-h-file-not-found

8.library not found for -lPods-orangeWar_TS

9.极光消息推送的identifier 'kJPFDidReceiveRemoteNotification'问题
把"jcore-react-native": "^1.3.1","jpush-react-native": "^2.5.1",两个^去掉再安装build就行

*/
