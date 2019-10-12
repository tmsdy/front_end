/*

参考：https://juejin.im/post/5be3ea136fb9a049f9121014
1.react规定我们必须把hooks写在函数的最外层，不能写在ifelse等条件语句当中，来确保hooks的执行顺序一致。

2.let [xList, setXlist] = useState([])，在setXlist时候会反复调用
https://segmentfault.com/q/1010000020315170

3.useEffect后面[]自动format加东西

*/