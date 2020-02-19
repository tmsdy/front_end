/*

1.adb:Android Debug Bridge
安装：brew cask install android-platform-tools 验证：adb devices
https://blog.csdn.net/lan_yangbi/article/details/82775812
执行：adb reverse tcp:8081 tcp:8081，从设备到电脑端口转发
然后就能愉快的调试、热加载了。npm start -- --reset-cache

2.chrome调试webview:chrome://inspect/#devices
在我们的MainActivity.java的onCreate方法加WebView.setWebContentsDebuggingEnabled(true);
记得import android.webkit.WebView;
有时候h5改了代码热更新有问题，重新进就好了

3.记得手机要设置仅限充电

4.打log
import android.util.Log;
Log.d('test','test======');

*/