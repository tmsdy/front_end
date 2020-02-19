/*

1.npm i http-server

2.开服务：http-server -p 8001

3.nginx: 高性能的web服务器，一般用于静态服务、负载均衡、反向代理
brew install nginx
nginx配置：/usr/local/etc/nginx/nginx.conf
改配置：sudo vi /usr/local/etc/nginx/nginx.conf

4.nginx命令：
测试配置文件格式是否正确：nginx -t
启动: nginx,重启：nginx -s reload
停止：nginx -s stop

5.
访问8888端口的/的代理到8001，/api/代理到4000
server {
        listen 8888;
        server_name localhost;
        location / {
                proxy_pass http://localhost:8001;

        }
        location /api/ {
                proxy_pass http://localhost:4000;
                proxy_set_header Host $host;
        }

}

*/