/*
1.真机：Unable to load script from assets 'index.android.bundle'
解决：https://blog.csdn.net/u010347226/article/details/79117940
index.js是入口js
运行打包：react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
adb reverse tcp:8081 tcp:8081
再跑：npm start -- --reset-cache

2.

*/