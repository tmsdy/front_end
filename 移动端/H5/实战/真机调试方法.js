/*

eruda使用：https://github.com/liriliri/eruda

js写法：
    (function () {
        var src = '//cdn.bootcss.com/eruda/1.2.4/eruda.min.js';
        if (!/eruda=true/.test(window.location) && localStorage.getItem('active-eruda') !== 'true') return;
        document.write('<scr' + 'ipt src="' + src + '"></scr' + 'ipt>');
        document.write('<scr' + 'ipt>eruda.init();</scr' + 'ipt>');
    })();
一般写法：
    <% if (env==='development') { %>
        <!-- eruda for test -->
        <script src="//cdn.jsdelivr.net/npm/eruda"></script>
        <script>eruda.init();</script>
    <% } %>

vConsole:
    <% if (env === 'development') { %>
        <!--vconsole for test-->
        <script src="//statics-web.iqiyi.com/common/jssdk/src/vconsole.min.js"></script>
        <script>var vConsole = new VConsole()</script>
    <% } %>


*/