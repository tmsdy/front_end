/*

git 安装 git 配置
本地：
git init

git status 看状态改变
git add .  把所有文件放到暂存区
git commit -m '描述' 提交版本 
git push

git log 查看各种版本
git log -p 查看具体改了啥
git checkout (7位+的版本id) 回到指定项目时间段
git checkout - 回到上一个版本

需要先切换到 master 然后 git pull 更新一下，再 git br 新分支
分支：测试没问题再合并到主分支
拿分支：
git pull 把线上分支拉到本地 git pull origin 本地分支名:远程分支名

git checkout 分支名 切换到分支
git branch 查看所有分支

分支写好后【正常提交步骤】之后需要合并到主分支
git checkout master   切换到master分支
git merge origin/index-swiper 线上新增的合并到本地master分支
git push 把master内容也提交到线上


*/