/*
mysql
1.安装：https://www.jianshu.com/p/35e7af7db96a

2.常见命令：
登录：mysql -u root -p
执行：sudo service mysql status|start|stop|restart分别是：查看mysql状态|启动mysql|停止mysql|重启mysql

3.远程登录mysql：https://blog.csdn.net/konglongaa/article/details/80996829
mysql数据库下已经没有password这个字段了，改成了authentication_string
use mysql;
select  User,authentication_string,Host from user;

阿里云添加3306的安全组，如果有防火墙也要加个3306
然后把这个配置文件的：/etc/mysql/mysql.conf.d/mysqld.cnf里面的bind-address注释掉
重启mysql：sudo service mysql restart
成功连上！

4.报错解决：Access denied for user 'root'@'localhost'
https://cloud.tencent.com/developer/article/1188636


*/