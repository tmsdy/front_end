/*

1.写日志：存在文件中
日志拆分，一般按2019-6-28日期拆分。用linux的crontab,即定时任务实现
设置定时任务：格式*(分钟)*(小时)*(日期)*(月份)*(星期)command(shell脚本)
编辑一个任务：crontab -e
* 0 * * * sh /Users/fei_han/Desktop/learn/front_end/nodeJs/new_learn/base/src/utils/copy.sh
看当前所有的定时任务：crontab -l
具体实现：凌晨的时候将access.log拷贝并重命名为2019-02-10.access.log，然后清空access.log文件，继续积累日志
copy.sh脚本
#!/bin/sh
cd /Users/fei_han/Desktop/learn/front_end/nodeJs/new_learn/base/logs
cp access.log ./access/$(date +%Y-%m-%d).access.log
echo "" > access.log
执行sh copy.sh
为什么用linux的crontab不用node？
node是操作系统上的进程，定时开进程搞不方便不合适，最好是操作系统搞

2.日志分析
针对access.log日志分析chrome的占比：日志是按行存储的，我们就按行读取看是chorme的条数占总条数的比例

*/