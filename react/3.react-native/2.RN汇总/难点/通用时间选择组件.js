/*

1.在基于RN mobile封装组件，但这个显示不显示不好控制的，把显隐放在组件里面最好，不然外面里面都控制的话，里面显隐状态改变了还要通知外边
看ActionSheet实现是ActionSheet.showActionSheetWithOptions(options, callback)
这样去做调用的，但我还不知道怎么封装
第一次解决：使用react-native-root-siblings库。看loading的实现，把显隐放在组件里面，外面调用实例的show和hide就能操作显隐了。
https://www.jianshu.com/p/6b57f7712636
问题：里面的是对象控制不了状态，还是得借助函数组件
最终解决：父级把maskOff和setMaskOff都传入子组件

*/
