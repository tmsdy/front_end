/*

1.mysql优点：
1）是企业内最常用的存储工具，一般都有专人运维，只需要一个用户名和密码申请权限去用就行
2）最流行的web server关系型数据库
安装：https://blog.csdn.net/qq_30507287/article/details/80216466
装了mysql完了才能连接上

2.建库(schema): 点圆饼

3.表：
建表：在库下面的tables右击create table,输入表结构，点apply
右击表可以编辑表(alter table),删除表(drop table)

4.表操作: 增删改查
加`password`可以解决关键字冲突问题

5.终端基本操作
登录：mysql -u root -p
看所有用户：select user();
退出：quit;

6.生成mysql当前unix时间戳：unix_timestamp(now());



*/