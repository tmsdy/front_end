/*
1. nginx: [error] invalid PID number "" in "/run/nginx.pid"
执行 nginx -t 是OK的，然而在执行 nginx -s reload 的时候报错
解决：先nginx -c /etc/nginx/nginx.conf，nginx.conf文件的路径可以从nginx -t的返回中找到。
再nginx -s reload

 */