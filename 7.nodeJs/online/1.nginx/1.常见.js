/*
权限不够记得加sudo
1.基本命令
更新包列表：apt-get update
安装nginx: apt-get install nginx
查看nginx版本：nginx -v

3.写项目配置文件：
cd /etc/nginx/conf.d
sudo vi rookiefeifei-top-3389.conf
cd ../
检测配置文件有没有错误：sudo nginx -t 
成功后重启nginx: sudo nginx -s reload

4.返回的头信息中有Server:nginx/1.10.3 (Ubuntu)信息
去掉：去nginx.conf里面把 server_tokens off;前面的#去掉
重载：service nginx reload


*/
