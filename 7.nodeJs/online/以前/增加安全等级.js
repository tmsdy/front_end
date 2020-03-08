/*
1.ssh登录限制：默认的端口22谁都知道，需要改
vi /etc/ssh/sshd_config
改完后：service ssh restart重启ssh
1）Port改成39999，相当于禁用了22端口的登录
登录的时候就得 ssh -p 39999 root@101.132.102.35了
2）
设置PermitRootLogin no：禁止root登录
添加 AllowUsers feifei：允许用户feifei登录，用户登录话操作有些要加sudo才行

2.防火墙配置
// 清空防火墙配置：iptables -F
看防火墙是否激活：ufw status
激活防火墙：ufw enable
改配置：vi /etc/iptables.up.rules
告诉防火墙配置文件在哪: iptables-restore < /etc/iptables.up.rules

3.还有别的加安全措施
1）指定特定ip才能访问：架设跳板机，得先连跳板机再去连生产服务器

*/