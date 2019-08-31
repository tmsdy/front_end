/*
1.起步
apt-get update: 更新软件源中的所有软件列表
安装docker:apt-get install -y docker.io
docker需要镜像，下载的地址在国外
阿里云加速器配置：https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors
按步骤配一配就行

2.基本使用
拉mysql的镜像：docker pull mysql:5.6
配置并跑mysql: docker run -p 3306:3306 --name mymysql -v /home/mysql/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=597232 -d mysql:5.6

3.基本概念
镜像（iamge）、容器（container）、仓库（registry）
一般docker pull把镜像从仓库中pull下来再去run成容器
仓库：分为公有和私有的仓库，Docker hub是默认的公有仓库

4.常见命令
查看docker版本：docker version
查看本地镜像：docker image ls
镜像删除: docker rmi nginx

*/