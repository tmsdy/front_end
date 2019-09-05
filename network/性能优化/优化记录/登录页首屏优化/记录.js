/*
优化的一个非常核心点让代码的利用率高，缓存不一定是很重要的点
1.在浏览器空闲时间(first contentful paint后)开始加载别的页面必要的文件，优先级是lowest的
<link rel="prefetch" href="<%= publicPath %>/static/UEditor/ueditor.all.js">
</link>

2.本来是想拆成登录页和首页两部分的。这样登录页加载速度能大大提高
问题：还是要加载打包好的首页资源，拆分有点难度。
采用：还是单页,

3.移除clamp.js文本溢出，手写替代

*/