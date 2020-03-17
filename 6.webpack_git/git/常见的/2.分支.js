/*

1.看分支：git branch 加-a看全部分支

2.创建本地分支：git checkout -b 新分支名 基于的分支(可选默认当前分支)
    在本地创建一个新分支，并自动切换到新分支

4.将远程git仓库里的指定分支拉取到本地（本地不存在）
git checkout -b test origin/test
git checkout -b dev-hf origin/dev-new

5.本地创建dev分支，提交并推到远程：https://blog.csdn.net/u013435007/article/details/90400710
创建dev分支：git checkout -b dev
改动提交后，
创建并推到远程dev分支：git push origin dev:dev

6.在dev分支上合并master分支代码：git merge master

6.合分支出问题：回退到 merge 合 自己分支之前那里，然后在自己分支上落后的时候拉merge不会有冲突，
然后再拉自己分支处理冲突


*/