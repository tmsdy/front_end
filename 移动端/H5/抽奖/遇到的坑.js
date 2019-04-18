/*

1.背景图不够长，用background-size: cover就行了，需要手动加前缀，iPhone X在app中打开有问题，在浏览器中打开正常
原因：iPhoneX适配 wkWebView屏幕下方有间隙的问题
解决方法：meta 加 viewport-fit=cover，body加padding-bottom: constant(safe-area-inset-bottom);
https://blog.csdn.net/yelin042/article/details/79837757

2.基线问题：
    1> ios默认有分享成功的气泡，基线可以干掉
    2> 分享的主标题配置，需要基线支持

3.想重复触发animation动画行不通，处理方法定3个不同keyframe起相同的效果


*/