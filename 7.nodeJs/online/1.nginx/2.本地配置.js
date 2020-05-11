/*
* 1.编辑配置：vi /usr/local/etc/nginx/nginx.conf

* 2.

server {
  listen 80 ;
  server_name dev_test.duozhun.cc;

  location / {
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_set_header X-Nginx-Proxy true;
    proxy_pass http://127.0.0.1:3000;
  }
}

*/
