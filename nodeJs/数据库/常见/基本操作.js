/*

1.增：insert into users(username,`password`,realname)values('fangfang','123','芳芳')
* 字符串记得要加''号,不加''号的会当作数字处理
主键存在相同就更新，不存在就添加：replace into users
字符串加""号防止字符串里面有''号，两个''会出问题

2.查询：
1）查所有的用户：select * from users; //用*有点耗性能
2）查id和username：select id,username from users;
3）查所有符合名字是feifei的用户：select * from users where username='feifei'
如果需要两个及上条件就再加个and `password`='123'类似这种
如果是几个条件符合一个就行就加个or就行
4）模糊查询：查名字带fei的：select * from users where username like '%fei%'
5）查询带排序：select * from users where username like '%fei%' order by id (默认是正序，后面加desc是倒序)
6）查时间范围的：https://www.cnblogs.com/zhangweibin/p/11002142.html
查今天：select * from 表名 where to_days(时间字段名) = to_days(now());
查昨天：select * from error_detail where to_days(now()) - to_days(createTime) <= 1

3.更新：
1）更新符合条件的数据：update users set realname='飞飞111' where realname='飞飞'
取消更新的安全模式：执行SET SQL_SAFE_UPDATES=0

4.删除
1）删除符合条件的数据：delete from users where username='feifei'
2）软删除：可以先把所有数据标记比如status=1,把不需要的可以设为0，这样可以保留数据



*/