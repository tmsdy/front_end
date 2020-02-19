/*
ios真机调试：
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
问题解决：https://yu.mantoufan.com/201910291717168224
https://stackoverflow.com/questions/37241579/install-claimed-to-have-succeeded-but-application-could-not-be-found-on-device
edit scheme里的build和run是debug & 保证有手机对应版本的的调试包, clean build folder
5）file -> Project Settings >  Build System > Legacy Build System

添加测试机：
1.开发网站里的devices添加
2.profile里面edit fumamx_dev钩上测试机再下下来覆盖掉原来的。

记录：
1.Library not loaded: @rpath/QBImagePicker.framework
link RSKImageCropper.framework和QBImagePicker.framework这两个，记得embed & sign

2.保证iPhone Distribution:的信任是系统默认的

3.Error: Multiple commands produce
解决：https://www.jianshu.com/p/fdb1421f3c8b
用Legacy build system代替New Build System

4.Library not found for -lPods-fumamxApp

加debugger ui产生的跨域问题：浏览器认为localhost请求本机地址:8081的bundle.js是跨域了
https://blog.csdn.net/weixin_33904756/article/details/85965598

*/