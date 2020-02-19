/*
docker run -p 3306:3306 --name mymysql -v /home/mysql/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=597232 -d mysql:5.6
容器运行：docker run
端口映射：
    3306:3306，主机和容器端口的映射，当访问了主机的3306端口就访问到了容器的3306端口了（就能外部访问了）
挂存储卷：docker像个进程，退出就没得数据了，想要数据持久化就得挂存储卷
    -v /home/mysql/data:/var/lib/mysql，宿主机和容器机子的容器做一个映射，容器生成的内容全部放到宿主机上
查看运行的容器：docker ps  查看所有、运行和退出的容器：docker ps -a
进入容器：docker exec -it + CONTAINER_ID /bin/bash
退出容器：exit
查看日志：docker logs -f + CONTAINER_ID
设置环境变量：一般可以在docker hub上查看库的说明能看到需要设置那些环境变量
    -e MYSQL_ROOT_PASSWORD=597232，指定mysql的root的密码
容器停止(退出)：docker stop + CONTAINER_ID
容器删除：docker rm + CONTAINER_ID

仓库登录：docker login ... 阿里云镜像仓库有

查看镜像：docker images
镜像构建、镜像打tag、镜像推送
    把本地文件打包成镜像，打上tag一般是版本号，再去推送
    docker build -t image_name:1.0.0 会找当前目录下的Dockerfile来镜像构建，加 -f /root/Dockerfile手动指定
    docker push image_name:1.0.0
*/