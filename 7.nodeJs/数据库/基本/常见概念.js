/*
1. QPS: 每秒钟处理完请求的次数，一般用来衡量单个接口服务的处理能力。
吞吐量：应用每秒钟最多能处理的请求数。单个reqeust对CPU消耗越高，外部系统接口、IO影响速度越慢，系统吞吐能力越低，反之越高。
并发量：数据库能同时处理的请求数。并发量 = QPS * 平均响应时间

2. TPS：每秒钟处理完的事务次数，一般TPS是对整个系统来讲的。
一个应用系统1s能完成多少事务处理，一个事务在分布式处理中，可能会对应多个请求。


3.

*/