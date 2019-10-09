/*

1.node的mysql丢失链接的处理。
https://stackoverflow.com/questions/20210522/nodejs-mysql-error-connection-lost-the-server-closed-the-connection

2.node连mysql出现：Cannot enqueue Query after fatal error。
node与mysql的连接不稳定，需要mysql池连接才行。
https://cloud.tencent.com/developer/ask/184787/answer/289896
https://fearby.com/article/how-to-setup-pooled-mysql-connections-in-node-js-that-dont-disconnect/
封装池连接操作：百度

3.没有模版的问题：No default engine was specified and no extension was provided.

4.需求：查询一个数据，如果有重复就count+1,没有就新增
暂时只能用2个sql，在看有没有一个sql能起效果。
用replace代替insert可以起一定的效果

5.node的new Date().getTime()生成的时间总是一样的

*/