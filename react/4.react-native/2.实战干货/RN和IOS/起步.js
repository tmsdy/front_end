/*
1.查看当前可用的所有设备/模拟器列表：xcrun simctl list devices
模拟器管理：https://www.jianshu.com/p/f2cbc2fba8d8
react-native run-ios --simulator "iPhone 7 Plus”
改react-native/local-cli/runIOS 下的findMatchingSimulator两处代码
1）if (version.startsWith('com.apple.CoreSimulator.SimRuntime.watchOS') || version.startsWith('com.apple.CoreSimulator.SimRuntime.tvOS')) {
2）!simulator.isAvailable

2.修改端口运行：
react-native/local-cli/server/server.js
https://blog.csdn.net/tfy_2425482491/article/details/80882394

3.删掉node_modules，xcode里面的配置并不会掉，还是在ios的project.pbxproj

4.ios启动时候卡在Loading dependency graph
查过程：
试着：http://localhost:8081/index.bundle?platform=ios ok的
网上说：各个库的IPHONEOS_DEPLOYMENT_TARGET版本过低（现在只支持ios8以上），watchman需要运行
进展：我看xcode的日志：Library not loaded，@rpath/FileBrowser.framework/FileBrowser
然后把react-native-file-selector的引用干掉了，就可以走编译了,但是还是卡在启动图。
*最后我把新增的这些选图片文件，富文本的库全干掉了再去重装npm i再跑就ok了
引起卡在启动图原因出在react-native-file-selector

5.用iTerm2跑服务：open node_modules/react-native/scripts -> launchPackager.command

6.跑ios -> react-native/local-cli/runIOS/


*/