/*
1.https://www.cnblogs.com/funbin/p/11154784.html
看mysql运行状态：systemctl status mysqld.service
找初始密码：grep "password" /var/log/mysqld.log

2.进mysql: mysql -uroot -p
改密码，改完才能操作：ALTER USER 'root'@'localhost' IDENTIFIED BY '新密码';
改密码可能出现密码不合规范，Faa597232#
看规范：SHOW VARIABLES LIKE 'validate_password%';

*/