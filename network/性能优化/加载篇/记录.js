/*
加载篇参考：https://juejin.im/post/5d00820b5188255ee806a1c7

1.优化带宽：照顾弱网的用户
  1）延迟加载
    懒加载：一页很多图，滑到下面图片将要进入屏幕才开始加载图片。可以节省很多流量
  2）提前加载：preload，prefetch
  3）不加载：走缓存
2.关键资源preload，prefetch：
preload：告诉浏览器优先加载关键js，css。最高优先级
<link rel="preload" href="main.js" as="script" >
<link rel="preload" href="style.css" as="style" >
先用performance看network里面优先级最高的请求让它优先加载

prefetch：什么时候闲了再去下载，用在某页面的文件大概率被用户使用



*/