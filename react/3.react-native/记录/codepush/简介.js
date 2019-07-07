/*

CodePush是微软提供的一套热更新RN，部署移动应用更新给用户设备的云服务器，
在修复小bug，加些新特性的时候不需要再打包可以直接推送代码进行实时更新
1）直接对用户部署代码更新
2）管理alpha，bete和生产环境应用
3）支持react-native和cordova
4）支持js文件和图片资源的更新

当app运行起来的时候，会从code-push服务器上检查是否有最新的bundle包，如果有的话会下载下来，再
通过CodePush.getJSBundleFile()来获取最新的包所在的位置


*/