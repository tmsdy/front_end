/*

（一）最先是页面右上方的小黑窗：其实提示已经说的很清楚了，它显示的就是我们的GPU占用率，能够让我们清楚地知道页面是否发生了大量的重绘。
（二）Layers版块：这就是用于显示我们刚提到的DOM渲染层的工具了，左侧的列表里将会列出页面里存在哪些渲染层，还有这些渲染层的详细信息。
（三）Rendering版块：这个版块和我们的控制台在同一个地方，大家可别找不到它。前三个勾选项是我们最常使用的，让我来给大家解释一下他们的功能（充当一次免费翻译）

①Paint flashing：勾选之后会对页面中发生重绘的元素高亮显示
②Layer borders：和我们的Layer版块功能类似，它会用高亮边界突出我们页面中的各个渲染层
③FPS meter：就是开启我们在（一）中提到的小黑窗，用于观察我们的GPU占用率

可能大家会问我，和我提到DOM渲染层这么深的概念有什么用啊，好像跟性能优化没一点关系啊？大家应该还记得我刚说到GPU会对我们的渲染层作缓存对吧，那么大家试想一下，如果我们把那些一直发生大量重排重绘的元素提取出来，单独触发一个渲染层，那样这个元素不就不会“连累”其他元素一块重绘了对吧。

那么问题来了，什么情况下会触发渲染层呢？大家只要记住：

video元素、WebGL、Canvas、CSS3 3D、CSS滤镜、z-index大于某个相邻节点的元素都会触发新的Layer，其实我们最常用的方法，就是给某个元素加上下面的样式：

    transform: translateZ(0);
    backface-visibility: hidden;
这样就可以触发渲染层啦(__) 。

我们把容易触发重排重绘的元素单独触发渲染层，让它与那些“静态”元素隔离，让GPU分担更多的渲染工作，我们通常把这样的措施成为硬件加速，或者是GPU加速。大家之前肯定听过这个说法，现在完全清楚它的原理了吧。

①蓝色部分：HTML解析和网络通信占用的时间
②黄色部分：JavaScript语句执行所占用时间
③紫色部分：重排占用时间
④绿色部分：重绘占用时间

*/