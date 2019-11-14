/*

1.Android resource linking failed(还不行)
进入 /用户/fei_han/.gradle/caches
https://www.jianshu.com/p/131f889021cc
解决：发现fumamxApp的build.gradle改成28版本的就行了

2.jar包冲突 - app:transformDexArchiveWithExternalLibsDexMergerForDebug
引入多种第三方框架时候。很容易报这个异常
https://blog.csdn.net/qq_24731595/article/details/53396228
解决：https://blog.csdn.net/zengruiyue/article/details/86627278

3.ant-design-mobile-rn的Tabs组件的坑
requireNativeComponent: 'RNCVIewPager' was not found in the UIManager
issue：https://github.com/ant-design/ant-design-mobile-rn/issues/663
https://github.com/react-native-community/react-native-viewpager/issues/18

*/