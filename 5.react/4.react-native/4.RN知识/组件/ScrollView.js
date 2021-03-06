/*
参考：https://reactnative.cn/docs/0.42/scrollview/

应用场景：简易的上下滑动窗口，如果渲染元素多应该使用ListView或者FlatList

1.给ScrollView设高度才能工作，
将一系列不确定高度的子组件装进一个确定高度的容器（通过滚动操作）

2.

RN端两种滚动实现方式
  1) ScrollView组件实现滚动
  2) View和responder手势响应系统实现滚动

属性：
scrollEnabled={false} //是否允许手势滚动
keyboardShouldPersistTaps="always" //保证点击其他地方输入框不失焦

*/
