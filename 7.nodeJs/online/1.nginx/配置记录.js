/*
* 第一版：请求101.132.102.35全代理到127.0.0.1:4000下
upstream react_ssr {
  server 127.0.0.1:4000;
}
server {
  listen 80 ;
  server_name 101.132.102.35; // 向这里的请求全转到upstream website下

  location / {
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_set_header X-Nginx-Proxy true;

    proxy_pass http://react_ssr;
    proxy_redirect off;
  }
}

* 第二版：请求www.houtian.fun，经过DNSPod指向101.132.102.35服务器，这里收到请求代理到127.0.0.1:4000下
upstream react_ssr {
  server 127.0.0.1:4000;
}

server {
  listen 80 ;
  server_name www.houtian.fun;

  location / {
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_set_header X-Nginx-Proxy true;

    proxy_pass http://react_ssr;
    proxy_redirect off;
  }
}

*/