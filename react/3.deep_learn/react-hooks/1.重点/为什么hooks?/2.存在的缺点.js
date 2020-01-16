/*

参考：https://juejin.im/post/5be3ea136fb9a049f9121014
* 1.react规定我们必须把hooks写在函数的最外层，不能写在ifelse等条件语句当中，来确保hooks的执行顺序一致。

2.let [xList, setXlist] = useState([])，在setXlist时候会反复调用，这种解构有开销。
https://segmentfault.com/q/1010000020315170

* 3.useEffect：每走一次都会走到它的销毁流程，想要保存不变量不容易，必须用useRef才行

* 4.useState当有很多state时候，如果几个合在一个useState里，设置的时候还要同时设置几个state才行

* 5.setFrom(0) 同步获得set后的值再操作很不方便，只能先把值变了传给后面的操作新值，再set新值

*/