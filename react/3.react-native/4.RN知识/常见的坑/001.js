/*

1.RN结合ts，引用index.tsx组件时候有时候需要把路径写全才会引用到

2.安卓要升级androidx，只支持sdk28以上的，很多库非最新版本的安卓build.gradle的sdk都是低于的，需要改，而且还有.java里面引入的旧包也要换成androidx新包，还有compile要换成implementation等
而且最蛋疼的是改了各种包的版本来适配，node_modules一变就要重新适配
解决方法：
升级库的版本，有的新版本就可以了，不过还是有更新不勤快的还是旧的
或者
降到26版本，在fumamxAPP的build.gradle里面
升级主要为了这个图片选择库：react-native-image-crop-picker

3.


*/