
/*

垃圾：从根节点开始，无法达到的所有的变量都是垃圾

垃圾回收GC（garbage collection）
1.从根节点开始遍历，找到所有的垃圾
2.在垃圾回收阶段把垃圾变量占用的内存返回给系统
3.像window，Object，Number这种全局变量不会被回收

*/