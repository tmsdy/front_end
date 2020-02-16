/*
css经典考题：https://juejin.im/post/5da282015188257d2a1c9e1d

1.flex布局：
*用不用：除了分层用定位和图文混排用float，其他布局完全可以用flex布局cover，小程序的布局也推荐flex布局。
*兼容性：安卓4.4以上(目前最低兼容就是4.4)，ios7.1以上(iphone6最低8.0了)，PC IE10以上(vue的Proxy都不支持了))

2.百分比大小
子级calc、margin、padding的百分比是相对父级的width
transform: translate(-50%,-50%) ; // 向左和向上分别移动50%，只有这个是相对自身的

3.两个display：inline-block元素放到一起会产生一段空白。
原因：HTML代码中的回车换行被转成一个空白符，在字体不为0的情况下，空白符占据一定宽度。
解决：父级设置字体大小为0

4.自适应
flex：不要太简单
定位：定位 + margin
float：float + BFC

5.垂直水平居中(8种)
display: flex、grid、table-cell
定位：四边auto + 左上50%，再用负marin、calc、transform


*/