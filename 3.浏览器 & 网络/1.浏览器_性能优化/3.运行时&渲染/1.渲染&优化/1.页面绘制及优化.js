/*
* 1.收到响应头中Content-Type：text/html 的http响应，浏览器开始解析和渲染

* 2.HTML解析成DOM Tree

* 3.CSS解析成CSSOM，DOM Tree + CSSOM = Layout Tree
    1）css来源于link标签引用、style标签、元素的内嵌
    2）css解析成CSSOM才能进入生成布局树，所以css解析会阻塞布局树生成，不然可能布局树渲染好css后解析好后又要回流多渲染一次

* 4.有了Layout Tree后，还要根据层叠上下文和对节点分层生成图层树
    1）不同图层有各自的绘制指令，合为一个绘制列表
    2）合成线程根据绘制列表的指令生成图块，图块栅格化生成位图数据，浏览器渲染进程进行渲染。

具体：https://www.rrfed.com/2017/02/26/chrome-layout/

优化策略：
1.把css放到head里，会阻塞渲染树的生成，防止二次渲染。给必需的css文件加rel="preload"，可以将请求优先级提到最高。

2.GUI线程和JS引擎线程是互斥的，js的加载和执行会阻塞渲染。js标签一般防止body标签最下面。
普通加载js：加载阻塞 & 执行阻塞
异步加载非核心js，加载都不阻塞：https://www.cnblogs.com/jiasm/p/7683930.html
    async：加载js，加载好就执行，执行阻塞。适合脚本之间独立不依赖的。
    defer：先加载，等文档渲染完毕后，在DOMContentLoaded事件调用前顺序执行，执行阻塞。适合脚本之间有依赖或者脚本会操作dom的。
*/