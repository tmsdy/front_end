/*
全面屏
1.大屏
1）长宽比不再是16:9，达到了19.5:9甚至更高
2）短边的像素、density的取值都是一样的，需要适配的是长边
3）华为mate20 Pro、iphoneXS Max、小米MIX3、vivo X23： 19.5/9
oppo R17 Pro: 19/9

2.存在的问题：
1）传统布局的高度不足，导致上下留黑边
2）基于屏幕顶部或底部的布局，如弹框，在全面屏手机上会发生位移
3）安全区域问题（iphone X顶部刘海旁边和底部小黑条为安全区域留给系统的不会触发点击）

3.适配要点
1）顶部NavigationBar上部预留安全区域
2）底部TabBar预留出安全区域
解决方案：
    1.采用SafeAreaView(RN5.0出的)来包裹页面适配安全区域
    2.借助DeviceInfo.isIPhoneX_deprecated是不是IPhoneX之类的全面屏手机来自定义实现安全区域（相对灵活）
    DeviceInfo.isIPhoneX_deprecated在安卓里是undifined

4.最佳实践：结合SafeAreaView还有DeviceInfo.isIPhoneX_deprecated封装一个适配全面屏的自定义通用组件


*/