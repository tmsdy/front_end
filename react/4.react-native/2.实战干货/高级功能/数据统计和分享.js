
/*

1.Umeng分享和登录SDK支持通过Cocoapods的集成方式，通过这种方式我们集成起来方便很多
橙战的iphone appkey: 5d259e333fc1953c13000684
橙战的android appkey: 5d243d494ca3570d98000883
// 2.Cocoapods安装：https://www.jianshu.com/p/ab6411a05bc2

3.安卓介入数据统计：https://developer.umeng.com/docs/66632/detail/101848
1）最外面build.gradle加：maven { url 'https://dl.bintray.com/umsdk/release' }
2）新建个trackshare的module
在build.gradle加：
    api  'com.umeng.umsdk:analytics:8.0.0'
    api  'com.umeng.umsdk:common:2.0.0'
给AndroidManifest.xml清单文件加权限：
<uses-sdk android:minSdkVersion="8"></uses-sdk>
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE"/>
<uses-permission android:name="android.permission.READ_PHONE_STATE"/>
<uses-permission android:name="android.permission.INTERNET"/>
4）在mainaActivity里面加：在统计页面的pv,uv和停留时长的时候有用
@Override
public void onResume() { //页面打开时候或者从后台切过来时
    super.onResume();
    MobclickAgent.onResume(this);
}
@Override
public void onPause() { //页面切到后台时
    super.onPause();
    MobclickAgent.onPause(this);
}
操作：
1）给app添加trackshare依赖，file -> project structure -> dependencies
这样在trackshare里面引入的友盟的sdk在app中也能用了
2）开发jsbridge

看视频12-07吧。。


*/