/*
xcode各种版本下载：https://developer.apple.com/download/more/

1.切换模拟器：https://www.jianshu.com/p/bb1ba50700bc

2.ios真机调试：
https://www.jianshu.com/p/8c99cb119bb3
https://www.jianshu.com/p/a3f3c8361cf1
1）需要这个项目的开发账号，在https://developer.apple.com/account
2）点击download profile就能拉下证书
3）在设备里拿到identifier添加到apple dev。
- 打包安装
4) edit scheme里面改成staging, 打包IOS，放到项目下。
5）Archive打包，选择那个build only device，不要勾选rebuild from bitcode
6）把导出的ipa文件拖到设备中就能安装了
- dev开发：Could not locate installed application
问题解决：https://yu.mantoufan.com/201910291717168224 https://stackoverflow.com/questions/37241579/install-claimed-to-have-succeeded-but-application-could-not-be-found-on-device
edit scheme里的build和run是debug & 保证有手机对应版本的的调试包, clean build folder
5）file -> Project Settings >  Build System > Legacy Build System

3.调试卡在启动图原因及解决：https://www.jianshu.com/p/411b4d6c82a6

4.卸掉xcode：https://www.jianshu.com/p/c93d5b64aa58
卸载出现的问题xcrun: error: active developer path
解决：sudo xcode-select --reset

5.清xcode缓存：~/Library/Developer/Xcode
(1) Archives 存放的是Xcode打包时生成的文件，这里面的文件可以全部删掉。
(2) DerivedData 存放的是build生成的项目索引、build输出以及日志，这里的文件可以全部删除。
(3) iOS DeviceSupport 存放的是模拟器，对于你不需要的一些模拟器你可以删掉。即使不小心删掉了，也是可以重新下载的。

6.找ios版本的debug调试包
/应用程序/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/DeviceSupport
