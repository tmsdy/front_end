/*
1.安卓某个库的sdk版本低了：
The specified Android SDK Build Tools version (26.0.3) is ignored, as it is below the minimum supported version (27.0.3) for Android Gradle Plugin 3.1.4.
Android SDK Build Tools 27.0.3 will be used.
解决：file -> project structure -> 去modules里面改

2.compile这个api过时了：
Configuration 'compile' is obsolete and has been replaced with 'implementation' and 'api'.It will be removed at the end of 2018.
解决：compile 改成 implementation
androidTestCompile 改成 androidTestImplementation
testCompile 改成 testImplementation

3.compileSdkVersion要和targetSdkVersion一致
buildToolsVersion可以注释掉

5.升级androidx：
https://www.jianshu.com/p/b0800f590e6e
https://www.jianshu.com/p/7dc111353328
新旧包对照：https://developer.android.com/jetpack/androidx/migrate

6.Android版本27以上使用http请求报错not permitted by network security policy
这个会导致你启动的时候reload没反应
原因：版本27以上限制了明文流量的网络请求，非加密的http流量请求都会被系统禁止掉。
解决：app->res下建个xml目录放个network_security_config.xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true" />
</network-security-config>
然后app的AndroidManifest.xml里面的application上加个
android:networkSecurityConfig="@xml/network_security_config"就行了

*/