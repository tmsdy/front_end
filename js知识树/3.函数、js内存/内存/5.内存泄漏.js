/*
*内存泄漏发生的原因
1. 缓存
有时候为了方便数据的快捷复用，我们会使用缓存,但是缓存必须有一个大小上限才有用。高内存消耗将会导致缓存突破上限，因为缓存内容无法被回收。
2. 计时器中引用没有清除
当浏览器队列消费不及时时，会导致一些作用域变量得不到及时的释放，因而导致内存泄漏。
3. 全局变量
除了常规设置了比较大的对象在全局变量中，还可能是意外导致的全局变量，如：
function foo(arg) {
    bar = "this is a hidden global variable";
}
4. 计时器中引用没有清除
先看如下代码：
var someData = getData();
setInterval(function() {
    var node = document.getElementById('Node');
    if(node) {
        node.innerHTML = JSON.stringify(someData));
    }
}, 1000);
这里定义了一个计时器，每隔1s把一些数据写到Node节点里面。但是当这个Node节点被删除后，这里的逻辑其实都不需要了，可是这样写，却导致了计时器里面的回调函数无法被回收，同时，someData里的数据也是无法被回收的。
5. 闭包
6. 事件监听


*/