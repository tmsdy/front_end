/*
1.yarn add react-native-vector-icons --save
react-native link react-native-vector-icons

安卓：android/app/build.gradle 中添加
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"

2.自定义
1）先在iconfont网站建项目自己上传图标，然后下载到本地.ttf文件
再走http://www.mamicode.com/info-detail-2343986.html
pip install fonttools出问题可能要加--user
每次执行：python iconfont-mapper.py iconfont.ttf iconfont.js
map里的数字可能要把字符串改成数字

配置iconfont.ttf
　　IOS: 把iconfont.ttf拖入Xcode项目里面的resources里，然后跟项目关联(勾一下)
编辑Info.plist添加下iconfont.ttf
https://github.com/oblador/react-native-vector-icons/blob/master/README.md
　　Android:  把iconfont.ttf 放在 \android\app\src\main\assets\fonts

*/
