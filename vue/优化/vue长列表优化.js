/*
情景：一个视口渲染了很多列表，如果第一屏全部渲染出来DOM数量过多
参考：https://www.cnblogs.com/imwtr/p/10428819.html
轮子：https://github.com/tangbc/vue-virtual-scroll-list

目标：仅仅动态渲染视口可见的数据

客户-客户管理列表：
dev:
初始：开始操作一样的，50条：172mb，1.35w个node，200条：274mb,3w4个node
优化后：开始操作一样的，50条和200条一样都是140mb,7400node

586:
初始：开始操作一样的，50条：125mb，200条：225mb


*/