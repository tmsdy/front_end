/*

移除 DOM 节点时候忘记移除暂存的值
有时候出于优化性能的目的,我们会用一个变量暂存 节点,接下来使用的时候就不用再从 DOM 中去获取.但是在移除 DOM 节点的时候却忘记了解除暂存的变量对 DOM 节点的引用,也会造成内存泄漏
var element = {
  image: document.getElementById('image'),
  button: document.getElementById('button')
};

document.body.removeChild(document.getElementById('image'));
//*  如果element没有被回收,这里移除了 image 节点也是没用的,image 节点依然留存在内存中.

与此类似情景还有: DOM 节点绑定了事件, 但是在移除的时候没有解除事件绑定,那么仅仅移除 DOM 节点也是没用的

*/