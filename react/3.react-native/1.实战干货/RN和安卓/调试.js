/*

1.chrome调试webview:chrome://inspect/#devices
https://www.cnblogs.com/lmyt/p/10584679.html

2.adb:Android Debug Bridge
安装：brew cask install android-platform-tools 验证：adb devices
https://blog.csdn.net/lan_yangbi/article/details/82775812
执行：adb reverse tcp:8081 tcp:8081，从设备到电脑端口转发
然后就能愉快的调试、热加载了。


*/