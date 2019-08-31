/*

1.用VMmare装个系统镜像就能跑虚拟机

2.
1）网络选择桥接模式(其他电脑能访问该虚拟机),要重启
2）设置root密码：sudo passwd root
3）设置ssh root链接，因为默认ssh是禁止root链接的
sudo apt install vim
apt-get install ssh
vim /etc/ssh/sshd_config
把PermitRootLogin 设为 yes，保存退出
重启：symtemctl restart sshd。
然后就能在任何地方ssh root@ip地址就能登录root了

3.关闭防火墙：ufw disable


*/