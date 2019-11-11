/*
1.react-native-splash-screen的问题
1）SplashScreen.h file not found
添加路径引用：
your project → Build Settings → Search Paths → Header Search Paths to add:
$(SRCROOT)/../node_modules/react-native-splash-screen/ios
我看到路径有，然后去node_modules里看了没有ios目录了，就重装了一下react-native-splash-screen就好了

2.react-native-image-crop-picker的问题
1）'React/RCTImageURLLoader.h' file not found
原因：仅react-native 0.61+包含“ RCTImageURLLoader.h”文件
或者可以安装低版本：npm i react-native-image-crop-picker@0.25.3 --save
2）library not found for -limageCropPicker
手动连接走一二步就行：https://reactnative.cn/docs/linking-libraries-ios.html

3.react-native-file-selector的问题
Could not find or use auto-linked framework 'FileBrowser'







*/