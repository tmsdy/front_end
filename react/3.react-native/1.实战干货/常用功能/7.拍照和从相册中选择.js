/*
参考：https://www.cnblogs.com/allenxieyusheng/p/7054463.html

1.github:
这个库不支持单选：https://github.com/react-native-community/react-native-image-picker
这个库支持多选安卓有问题：https://github.com/ivpusic/react-native-image-crop-picker
https://www.jianshu.com/p/8420b08062c7

2.link不上没有效果需要手动link：https://reactnative.cn/docs/linking-libraries-ios.html
不要走第三步，否则不起作用

3.<Image>标签加载图片的方式
加载本项目里的：<Image source={require('./img/icon.jpg')}/>
加载网络图片：<Image source={{uri: 'http://..................*.jpg'}}/>
加载本地图片：<Image source={{uri: 'file://' + path}}/>

4.遇到的react-native-image-crop-picker问题
安卓编译问题：https://github.com/ivpusic/react-native-image-crop-picker/issues/835
加：maven {url 'https://jitpack.io'}
然后有androidx的包，项目要升到androidx。
import androidx.core.app.ActivityCompat;
import androidx.core.content.FileProvider;

5.升级androidx：
https://www.jianshu.com/p/b0800f590e6e
https://www.jianshu.com/p/7dc111353328
新旧包对照：https://developer.android.com/jetpack/androidx/migrate

6.一般步骤
npm i react-native-image-crop-picker
react-native link react-native-image-crop-picker
安卓加
maven { url "https://jitpack.io" }
<uses-permission android:name="android.permission.CAMERA"/>

*/
