

/*

1.尽量不要在window上挂东西，不管是在function里面误挂上的还是主动挂上去的都不行，
因为全局变量是不会被浏览器回收的。window.PinyinHelper window.PinyinFormat

2.被遗忘的计时器或回调函数。

3.所有事件监听记得在组件销毁的时候去除它。

4.删掉父组件A，但是由于子组件B仍然存在所以A组件还是活在内存中。所以千万不要把this搞进闭包里面了，不然整个项目组件的内存都泄漏了。比如：
1）在封装的方法引用this。
2）event-bus $on注册的事件中引用this，一定记得要在beforeDestroy时候$off掉

5.还有像echart图表对象、地图Map对象等实例化后也要记得在组件销毁的时候remove掉。

*/