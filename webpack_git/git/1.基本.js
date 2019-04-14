/*
1.配置user信息，当那块出问题别人指出可以自动发邮件提醒。
git config --global user.name ''
git config --global user.email ''
看现有的配置包括alias的：
    git config --list
    git config --list --global

2.git add . 添加到暂存区(stage)
    1> 如果想临时保存写的第一套方案，可以先放到暂存区，然后写第二个方案，不满意的话可以用暂存的第一个覆盖第二个

3.只是变更文件名用：git mv image images,把image文件夹更名为images文件夹

4.查看版本历史
默认查看：git log
简洁查看+最近5个：git log -n5 --online

*/