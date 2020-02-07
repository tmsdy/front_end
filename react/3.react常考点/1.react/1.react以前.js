/*
* 1.PureComponent: 原理还是用shouldComponentUpdate来浅比较前后props或者前后state是否变化了，变化则渲染不变不渲染
    PureComponent有时候不好使，还是shouldComponentUpdate靠谱

* 2.事件绑定this的方式，子组件用了PureComponent优化
    1）构造函数中：父组件刷新时，若其他props值不变，子组件不会刷新（用这个）
    2）render()函数中：bind 函数会返回一个新的函数，父组件刷新时，即使其他的props不变，子组件还会刷新
    3）使用箭头函数：父组件刷新时，都会生成一个新的箭头函数，子组件还会刷新
    综上所述，如果不注意的话，很容易写成第三种写法，导致性能上有所损耗。

3.



*/