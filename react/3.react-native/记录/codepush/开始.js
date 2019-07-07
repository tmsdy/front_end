/*

1.npm i -g code-push-cli

2.终端输入code-push register注册授权账号,用户名fei_han
登录：code-push login

3.在codepush上注册我们的app,获取deployment key
code-push app add fumasoft/orangeWar_android android react-native
code-push app add fumasoft/orangeWar_ios ios react-native
也有remove,rename,list等命令

4.集成code-push SDK
1)npm i --save react-native-code-push
2)在安卓项目里用rnpm装插件：npm i -g rnpm
3）自动化集成命令：rnpm link react-native-code-push,将code-push相关配置添加到项目里面
或者rnpm link react-native-code-push
这样安卓iOS就有codepush的相关代码了

5.使用codepush热更新
设置更新策略：在app启动的时候更新还是用户点击手动更新。是立即跟新还是下次进入加载新的jsbundle包
import CodePush from "react-native-code-push"
只要调用CodePush.sync()就会后台请求更新,如果可以更新会后台静默的将更新下载到本地，等待app下一次启动的时候应用更新
如果是强制性的，下载好会立即进行更新

6.部署项目到codepush服务器
通过 code-push release-react简化方式将项目代码打包成bundle包
code-push release-react fumasoft/orangeWar_android android --dev false --d Production --des "" --m true
code-push release-react fumasoft/orangeWar_ios ios --dev false --d Production --des "" --m true
1）deploymentName: 更新的环境是开发还是生产，默认是Staging开发环境的,开发要加--d(deploymentName) Production
2）-t(targetBinaryVersion): 针对某个版本的更新，其他版本不受影响
看发布信息：code-push deployment ls orangeWar_android
code-push deployment ls orangeWar_ios

查找更新日志：code-push deployment history orangeWar_android Staging

7.本地测试热更新
ios:
打包：创建bundles目录
执行react-native bundle --entry-file index.js --platform ios --dev false --bundle-output ./bundles/main.jsbundle --assets-dest ./bundles
把打包的文件放到ios里面，注释掉debug里本地的bundle包，只去codepush里面去拉
发布Ios应用，申请appid -> 在tunes connect创建应用 -> 打包程序 -> 将应用提交到app store等几大步骤

android: 打包成apk：./gradlew assembleRelease -x bundleReleaseJsAndAssets

*/