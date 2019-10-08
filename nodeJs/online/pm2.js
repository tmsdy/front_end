/*

1.用pm2管理nodejs脚本的时候pm2命令找不到，因为pm2在服务器上使用的是非交互的链接方式
解决：在服务器根目录下vi .bashrc,注释case那几行
然后source .bashrc

2.pm2查看log：pm2 log fumamx-monitor-node_test

*/