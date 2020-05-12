/*
1. nginx: [error] invalid PID number "" in "/run/nginx.pid"
执行 nginx -t 是OK的，然而在执行 nginx -s reload 的时候报错
解决：
sudo nginx -c /usr/local/etc/nginx/nginx.conf
sudo nginx -s reload

2.nginx: [alert] kill(21725, 1) failed (1: Operation not permitted)
解决：nginx 缺少启动权限，sudo nginx -s reload


 */
