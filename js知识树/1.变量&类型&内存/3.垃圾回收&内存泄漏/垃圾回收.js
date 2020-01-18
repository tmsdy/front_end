/*

*js 调用栈中的数据回收
js引擎会通过向下移动 ESP(记录当前执行状态的指针) 来销毁该函数保存在栈中的执行上下文。

*js 堆中的数据回收：V8分成新生代和老生代两个区域
新生代: 存放生存时间短的对象（临时变量之类）,只有1～8M 的容量，副垃圾回收器来回收垃圾。
老生代: 存放的生存时间久的对象,容量很大，主垃圾回收器来回收垃圾。

*新生代中垃圾回收（Scavenge GC）
把新生代空间对半划分为对象区域(From)和空闲区域(To)。
存活对象列表：老生代对象每次指向一个新生对象的时候，记录下来；每次删除指向的时候，删除记录。
对象区域：新生对象诞生存这里，当对象区域快被写满时，触发 Scavenge GC。存活对象列表里存的From存活的对象复制到To空间并整理(防止出现内存碎片)，清空From空间(清除了垃圾)，然后From To 空间角色互换，开始下一轮循环。
为了防止新生区很快被占满，经过两次垃圾回收依然还存活的对象，会被移动到老生代区中。

*老生代中的垃圾回收：标记清除法
先把所有变量都加上标记，再从根元素开始找引用的对象(递归遍历调用栈)，然后去掉环境中的变量及被环境中的变量引用的变量的标记，然后还有标记的变量将会被删除来回收内存(环境中的变量访问不到了)。
问题：清除垃圾后，会产生大量不连续的内存碎片。而碎片过多会导致大对象无法分配到足够的连续内存。

整理内存：Mark-Compact标记压实算法，和标记清除过程差不多，不过最后是让所有存活的对象都向一端移动，然后直接清理掉端边界以外的内存，从而让存活对象占用连续的内存块。

* 注意
局部变量：函数执行完毕局部变量便没啥用了，因此垃圾收集器很容易做出判断并回收。
全局变量：全局变量什么时候需要自动释放内存空间则很难判断，所以在开发中尽量避免使用全局变量。

*/