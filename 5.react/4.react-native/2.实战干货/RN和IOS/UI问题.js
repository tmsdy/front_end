/*
1.ios的borderRadius要设为宽度的一般才能显示圆形

2.真机问题：
1）ios窄边框十六进制颜色显示有问题，用rgba颜色正常
borderBottomColor: isIOS ? 'rgba(255,255,255,0.3)' : '#f4f4f4',

2）一直聚焦输入框遮盖弹框，键盘遮挡问题解决：https://www.jianshu.com/p/1c6602f9dbd7
ios command+shift+k现实还是隐藏输入框。
尝试了ScrollView，KeyboardAvoidingView等等方法，感觉还是手动调textinput的blur失焦好用

3）ios上传图片res.body为空

4）

*/