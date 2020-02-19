
/*

1.删除commit: git branch -D 分支名

2.改最近commit的提交信息：git commit --amend 进去编辑
然后可以git log -1查看最近这一条commit

3.基于git rebase(变基) -i (被变的父级的commit id)
    1）修改任意commit信息：
        git log列出commit
        比如要改信息用到reword，然后:wq出去就可以跳到编辑commit界面了
    2）合并多个commit，用到里面的squash

*/