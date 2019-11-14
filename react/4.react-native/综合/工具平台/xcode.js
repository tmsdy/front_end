/*
xcode各种版本下载：https://developer.apple.com/download/more/

1.切换模拟器：https://www.jianshu.com/p/bb1ba50700bc

2.ios真机调试：https://www.jianshu.com/p/8c99cb119bb3
调试卡在启动图原因及解决：https://www.jianshu.com/p/411b4d6c82a6

4.卸掉xcode：https://www.jianshu.com/p/c93d5b64aa58
卸载出现的问题xcrun: error: active developer path
解决：sudo xcode-select --reset

5.清xcode缓存：~/Library/Developer/Xcode
(1) Archives 存放的是Xcode打包时生成的文件，这里面的文件可以全部删掉。
(2) DerivedData 存放的是build生成的项目索引、build输出以及日志，这里的文件可以全部删除。
(3) iOS DeviceSupport 存放的是模拟器，对于你不需要的一些模拟器你可以删掉。即使不小心删掉了，也是可以重新下载的。
