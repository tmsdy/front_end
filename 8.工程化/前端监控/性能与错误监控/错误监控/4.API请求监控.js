/*
1.现在发请求无外乎XMLHttpRequest和fetch,把这俩都介入就行了

2.一定要确保不能出现写的错误监控报错然后反复上报的情况，可以try catch来抛出自定义的错，如果遇到这种错就不上报了

3.当response的status不在成功区间的状态码时上报api报错，在成功区间的状态码时上报api请求性能
先把4xx，5xx的当api报错上传了。

*/