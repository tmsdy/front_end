/*
1.避免在主库数据库备份

*2.联合主键：以两个字段一起作为联合主键，只有两个数据的联合主键都相同时才算重复数据

3.message存mysql失败
message=Cannot%20read%20property%20%27getData%27%20of%20undefined
这是unicode编码，需要解码：
unescape('Cannot%20read%20property%20%27getData%27%20of%20undefined')

4.时间戳类型的抉择：https://my.oschina.net/frankwu/blog/1626886
存时间用datetime不用int


*/