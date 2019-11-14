/*
参考：https://www.jianshu.com/p/94e2ee797457
1.RN端和web端点击的实用对比：
1）web端DOM元素都能点击而RN端就提供四个可点击的组件
2）当内外多层添加点击事件，RN端只触发内层组件的事件回调函数(onResponderTerminationRequest默认返回false，当有其他组件请求接替响应者时，当前组件不放权), Web端会先触发内层再触发外层的事件回调函数(stopPropagation默认不阻止事件冒泡)。

2.RN端与Web端手势系统对比
  (1) RN端和Web端手势系统都可以指定事件触发时机(捕获阶段/冒泡阶段)，RN端是通过响应者的声明方法进行指定，Web端是通过addEventListener事件处理函数的第三个参数进行指定。
  (2) 当有多层视图添加手势响应系统时，RN端默认只有一个responder响应者。Web端默认多层全部都是响应者。
  (3) RN端通过onResponderTerminationRequest手势系统方法的方式解决内外层手势冲突，比较方便。Web端通过stopPropagation阻止事件冒泡的方式解决内外层手势冲突。
  (4) RN端的PanResponder手势系统的封装性更好，提供了从触摸操作开始时的累计横/纵向路程，简化开发者的代码逻辑。
  (5) RN端提供了更全面的接口方法，包括响应阶段、响应过程、响应放权与响应失败。与RN端提供的方法相比，Web端相当与只提供了响应过程的接口方法。

3.

遇到的问题
1.上级收不到下级点击事件的冒泡




*/
