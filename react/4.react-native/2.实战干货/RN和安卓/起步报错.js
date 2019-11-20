/*
1.真机：Unable to load script from assets 'index.android.bundle'
解决：https://blog.csdn.net/u010347226/article/details/79117940
index.js是入口js
运行打包：react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

adb reverse tcp:8081 tcp:8081
npm start -- --reset-cache

2.The minSdk version should not be declared in the android manifest file.
解决方案 把manifest.xml 里的sdk最小版本设置都删掉 Androidstudio3.0 以后 不能在manifest.xml 设置这些 必须在 gradle里设置

3.

*/