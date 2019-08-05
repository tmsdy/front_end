/*

1.白屏的性能优化
白屏时间内发生了什么:
  1）回车按下,浏览器解析网址,进行 DNS 查询,查询返回 IP,通过 IP 发出 HTTP(S) 请求
  2）服务器返回HTML,浏览器开始解析 HTML,此时触发请求 js 和 css 资源
  3）js 被加载,开始执行 js,调用各种函数创建 DOM 并渲染到根节点,直到第一个可见元素产生
  1.1：webpack加白屏时候的loading图
    new HtmlWebpackPlugin({
      template: './src/index.html',
      loading: loading
    })
  1.2：开启http2
    参考：https://juejin.im/post/5d00820b5188255ee806a1c7#heading-6
  1.3：开启浏览器缓存


*/