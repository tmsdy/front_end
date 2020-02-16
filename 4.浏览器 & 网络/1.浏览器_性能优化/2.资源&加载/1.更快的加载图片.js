/*

* 1.图片的选择
    1）很小的小图标直接base64内嵌。
    2）小png图片图标用iconfont字体图标代替。
    4）小图片色彩简单的用png，偏大的色彩丰富的用jpg。动画用gif。

* 2.压缩图片：图片在用的时候都需要压缩一下，但不要gzip压缩图片。

* 3.服务端根据不同图片url自动进行不同处理原图片并返回。
1）在wifi/5g/4g/3g不同网络环境下加载不同尺寸像素的图片。网络越好的看的图片越好。
    方法：在图片url后缀中采用不同后缀来标识
    3g用100x100的：http://imgxxx.com/xxx/100x100_jfs/xxx123xxx.jpg
    wifi用500x500的：http://imgxxx.com/xxx/500x500_jfs/xxx123xxx.jpg
    尽可能通过srcset，sizes和<picture>元素使用响应式图片。还可以通过<picture>元素使用WebP格式的图像。
2）根据不同图片后缀服务器可以把图片转格式返回。
3）还有可以支持图片压缩、图片裁剪、添加水印、高斯模糊、智能鉴黄/抠图/配色等等处理。

* 4.图片加载好之前用默认的占位符或者svg低质量占位符。
sqip工具用图片生成低质量占位符。

参考：
https://mp.weixin.qq.com/s/PDD3GxFyYptwEl0q_XaW2g


*/