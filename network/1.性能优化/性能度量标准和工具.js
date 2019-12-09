/*
1.工具：
PageSpeed Insights
Chorme User Experience Report: 比较强大，可生成各种想要的报表，暂时不知道咋用
lightHouse
pageSpeed
* chorme自带Performance：http://www.mamicode.com/info-detail-2380589.html

2.目标
100毫秒的界面响应时间与60FPS
速度指标（Speed Index）小于1250ms
3G网络环境下可交互时间小于5s
重要文件的大小预算小于170kb
js的执行不能超过100ms，会阻塞渲染让用户感觉到卡，大概是卡了6帧的时间了。

3. 加载事件先后: FP前面都是白屏状态，LCP内容都能看到了。
DCL：DomContentedLoaded
FP: first-paint
第一屏内容 FCP: first-contentful-paint
整屏内容 LCP: largest-contentful-paint
L: onload
取值：performance.getEntriesByName('first-contentful-paint)



*/
