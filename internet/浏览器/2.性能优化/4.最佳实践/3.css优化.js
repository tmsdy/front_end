/*

1.避免使用CSS表达式,强大又危险
    background-color: expression( (new Date()).getHours()%2 ? "#B8D4FF" : "#F08A00" );

2.选择<link>舍弃@import，为了实现逐步渲染，CSS应该放在head里。
    在IE中用@import与在底部用<link>效果一样，所以最好不要用它。

3.css合并压缩: 所有CSS文件都需要被压缩，从生产文件中删除注释，空格和空行。
    合并css：MiniCssExtractPlugin 
    压缩css：optimize-css-assets-webpack-plugin插件配合 cssnano.co 使用

4.非阻塞引入css：防止DOM花费更多时间才能渲染完成
    <link rel="preload" href="global.min.css" as="style" onload="this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="global.min.css"></noscript>    
    使用preload实际上可以在浏览器开始显示页面内容之前加载CSS文件
    做法：需要添加rel属性并赋值preload，并在<link>元素上添加as=“style”

5.关键CSS：将页面渲染时必备的CSS通过<style></style>的方式内联到页面中（尽可能压缩后引用）
    内联关键CSS有助于加速网页的呈现，减少对服务器的请求数量
    做法：使用在线工具或使用Addy Osmani开发的插件生成关键CSS。

6.布局注意点：
    1）避免使用table布局，很小的一个小改动会造成整个 table 的重新布局
    2）将动画效果应用到position属性为absolute或fixed的元素上
    3）给频繁动画元素的父级加transform: translateZ(0) 启动GPU加速，并且对原本布局毫无影响

*/