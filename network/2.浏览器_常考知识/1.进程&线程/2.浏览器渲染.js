/*

1.解析 HTML 文件,构建 DOM 树,同时浏览器主进程负责下载 CSS 文件
2.CSS 文件下载完成,解析 CSS 文件成CSSOM,然后结合 DOM 树合并成 Render tree
3.布局 Render tree （Layout/reflow）,负责 Render tree中的元素的尺寸,位置等计算,接着绘制 Render tree （paint）,绘制页面的像素信息
4.浏览器主进程将默认的图层和复合图层交给 GPU 进程,GPU 进程再将各个图层合成（composite）,最后显示出页面



*/