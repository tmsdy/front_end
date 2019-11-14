/*
参考
https://www.jianshu.com/p/b0800f590e6e
https://www.jianshu.com/p/7dc111353328
升级AndroidX：
新旧包对照：https://developer.android.com/jetpack/androidx/migrate

*1.什么是AndroidX？
AndroidX是对android.support.xxx包的整理后产物

*2.为什么要迁移AndroidX？
之前的support包过于混乱，解决了support包混乱不堪的状况。官方会逐步放弃对support包的升级和维护。

*3.AndroidX特点
1）AndroidX的迁移要求在在AndroidStudio 3.2 或更高版本中执行，要求的targetSdkVersion版本为28（android9.0），classpath 'com.android.tools.build:gradle:3.2.0'要3.2.0或者更高。

常见对照：
android.support.v4.app.ActivityCompat androidx.core.app.ActivityCompat
android.support.v7.app.AppCompatActivity androidx.appcompat.app.AppCompatActivity
android.support.v4.content.ContextCompat androidx.core.content.ContextCompat
android.support.annotation.RequiresApi androidx.annotation.RequiresApi
android.support.v4.content.FileProvider androidx.core.content.FileProvider


adb reverse tcp:8081 tcp:8081
npm start -- --reset-cache






*/