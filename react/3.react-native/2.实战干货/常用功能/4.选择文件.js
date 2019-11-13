/*

1.npm install react-native-file-selector --save
react-native link react-native-file-selector
github:https://github.com/prscX/react-native-file-selector
rn版本0.60前后还不一样

2.安卓：
android build.gradle > maven {url  "http://dl.bintray.com/lukaville/maven" }
android build.gradle > implementation project(':react-native-file-selector')
AndroidManifest.xml下：
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
自定义主题色，colors.xml下：
<color name="colorPrimary">#3F51B5</color>
<color name="colorPrimaryDark">#303F9F</color>
<color name="colorAccent">#FF4081</color>

3.ios
rn版本0.60前的对应0.x的react-native-file-selector的步骤：
1.在Libraries下建个RNFileSelector文件夹，把Pods.xcodeproject，RNFileSelector.xcodeproject都放进来，然后走一波项目 -> Build Phases -> Link Binary With Libraries
把xcodeproj下的Products文件夹中的.framework和.a文件都拖进来
2.走一波项目 -> Build Settings -> Search Paths -> Framework Search Paths把.framework的路径拉进来还有Header Search Path把.a文件路径拉进来
!选择文件问题：卡在fileBrowser.framework找不到。万总决定不做了就不搞了。

4.



*/