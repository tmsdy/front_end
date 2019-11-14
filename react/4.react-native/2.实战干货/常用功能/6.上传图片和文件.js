/*
1.react-native-fs 记得手动link
link第一个.a文件

2.上传：RNFS.uploadFiles(options).promise
在安卓正常，在ios只有begin和progress，这个promise reject了
推断：
1）选图片时候以file:///data/user/...开头的图片路径才能正常上传

*/