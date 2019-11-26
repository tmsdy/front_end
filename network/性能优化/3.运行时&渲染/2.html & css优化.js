/*

1.压缩html,css,删除注释，空格和空行。

2.css放到head里，会阻塞渲染让渲染逐步进行，不然渲染的时候css还没加载好，加载好时候又渲染一次

3.非阻塞引入css：防止DOM花费更多时间才能渲染完成
    <link rel="preload" href="global.min.css" as="style" onload="this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="global.min.css"></noscript>
    使用preload实际上可以在浏览器开始显示页面内容之前加载CSS文件
    做法：需要添加rel属性并赋值preload，并在<link>元素上添加as=“style”

4.布局注意点：
1）避免使用table布局，很小的一个小改动会造成整个 table 的重新布局
2）将动画效果应用到position属性为absolute或fixed的元素上
3）给频繁动画元素的父级加transform: translateZ(0) 启动GPU加速，并且对原本布局毫无影响

*/