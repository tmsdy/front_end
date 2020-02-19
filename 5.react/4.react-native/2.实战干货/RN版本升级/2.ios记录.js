/*

1. library not found for -lDoubleConversion
解决：必须使用XXX.xcworkspace打开xcode
https://github.com/react-native-community/react-native-maps/issues/2829

2.pod高德地图库出现的问题：2 duplicate symbols for architecture x86_64
原因：在React Native中react-native-code-push和react-native-amap3d 函数名称冲突问题.
解决在第十一条：https://juejin.im/post/5b4d47e96fb9a04f844abde0

3.要把React -> JavaScriptCore.framework加入link

4.Native module cannot be null
注释就行：https://www.jianshu.com/p/73344f5a003e

*/