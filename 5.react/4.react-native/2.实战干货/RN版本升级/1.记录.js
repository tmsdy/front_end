/*
升级指导：https://react-native-community.github.io/upgrade-helper/?from=0.57.8&to=0.61.2
1：Error:A problem occurred configuring project ':app'
解决：https://stackoverflow.com/questions/53717769/a-problem-occurred-configuring-project-app

2.Could not find com.android.tools.build:gradle:3.2.0.

3.could not get unknown property ‘mergeResourcesProvider’
android/app/gradle/wrapper/gradle-wrapper.propeties里：
distributionUrl=https\://services.gradle.org/distributions/gradle-4.10.2-all.zip

4.运行时闪退的错误日志：
couldn't find DSO to load: libhermes.so
（最后一个解决了）：https://github.com/facebook/react-native/issues/25923
两个build.gradle都要改

5.[TAG] Failed to resolve variable '${project.version}'
https://www.jianshu.com/p/7b43af6c91ca

6.code push报错：找不到reactNativeCodePush_androidDeploymentKey
在res/values/strings.xml中添加
<string name="reactNativeCodePush_androidDeploymentKey">code push key</string>

7.低版本react-native-webview报错：Failed resolution of: Lcom/facebook/react/views/webview/ReactWebViewManager;


*/