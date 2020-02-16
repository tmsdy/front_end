/*

1.Detached DOM tree（红色节点）
没有从JavaScript到它们的直接的引用，但它们是分离出来的DOM结构的一部分，所以他们还是在内存中保留了。有可能有一个节点被JavaScript引用到了(可能是在闭包中或者一个变量)，这个引用会阻止整个DOM树被内存回收。

2.黄色节点(黄色背景)有JavaScript的直接引用。在同一个分离的DOM树中查看一个黄色的节点来定位你的JavaScript的引用。就可能看到从DOM window到那个节点的属性引用链

3.
对象在内存中两种存在方式：
Shallow Size：对象直接占用内存大小
Retained Size： 占用总内存，对象引用所有变量的累积
    被原生对象(象DOM对象)隐含的包留引用，会因为阻止对象被GC自动回收，而有导制内存泄漏的可能。对象自身占用的内存被称为直接占用内存(通常来说，数组和字符串会保留更多的直接占用内存(shallow size))。

4.constructor和retained字段下有很多的数据。我应该从哪开始调查我是的否遇到了内存泄漏呢？
一般来说最好是从通过retainers排序的第一个对象开始，retainers之间是通过距离排序的(是指到window对象的距离)。距离最短的对象有可能是首选的可能导致内存泄漏的对象。

5.Summary, Comparison, Dominators 和 Containment这些视图之间的不同是什么？
Summary(概要)视图能帮你通过构造函数分组寻找对象(和对象的内存使用)。该视图对找出DOM内存泄漏很有帮助。
Comparison(对照)视图能够通过显示哪些对象内存被正确的回收了来搜寻内存泄漏。通常在一个操作前后记录两个(或更多)的内存使用快照。它是通过察看释放的内存和引用数目的差导来察看是否有内存泄漏，并找到原因。
Containment(控制)视图对对象结构有更好的展示，帮助我们分析全局作用域(如 window)中对象引用情况来找到是什么保留了这些对象。它能让你分析闭包并深入到对象更深层去查看。
Dominators(支配者)视图能用来帮助我们确认没有多余的对象还挂在某个位置(如那些被引用了的)，和确认对象的删除/垃圾回收真正起了作用

6.堆分析仪中的constructor(一组)内容代表什么？

(global property) - 全局对象(像 ‘window’)和引用它的对象之间的中间对象。如果一个对象由构造函数Person生成并被全局对象引用，那么引用路径就是这样的：[global] > (global property) > Person。这跟一般的直接引用彼此的对象不一样。我们用中间对象是有性能方面的原因，全局对象改变会很频繁，非全局变量的属性访问优化对全局变量来说并不适用。
(roots) - constructor中roots的内容引用它所选中的对象。它们也可以是由引擎自主创建的一些引用。这个引擎有用于引用对象的缓存，但是这些引用不会阻止引用对象被回收，所以它们不是真正的强引用(FIXME)。
(closure) - 一些函数闭包中的一组对象的引用
(array, string, number, regexp) - 一组属性引用了Array,String,Number或正则表达式的对象类型
(compiled code) - 简单来说，所有东西都与compoled code有关。Script像一个函数，但其实对应了<script>的内容。SharedFunctionInfos (SFI)是函数和compiled code之间的对象。函数通常有内容，而SFIS没有(FIXME)。
HTMLDivElement, HTMLAnchorElement, DocumentFragment 等 – 你代码中对elements或document对象的引用。
在你的程序的生命周期中生成的很多其它的对象，包括事件监听器或自定义对象，可以在下面的controllers中找到：

7.我在做内存分析时需要关闭Chrome里可能会产生影响的什么功能么？
我们建议在用Chrome DevTools做内存分析时，你可以使用关闭所有扩展功能的隐身模式，或设置用户文件夹为(--user-data-dir="")后再打开Chrome。

*/
