/*
1.server端
入口：
- app/page/task/component/create/index.js
  在这里可以自定义写表单modal

- app/page/task/component/result
  在这里写详情组件，写好记得在index.js中引入配上

- app/page/task/component/search
  这里是每个模块点击展示的表单填写页，可以配置各个表单

- server/controller/task-detail.js
  在这里请求数据库存的detail数据当作dateSource给detail组件

- server/model-repo/...
  各模块

/app/page/task/component/create/index.js

* 发布部署：石磨部署在里面机房的 mac 上。
登录：ssh dz@192.168.1.155 密码：duozhun
发测试：进入script目录，
chmod 777 deploy-test.sh -> 给文件权限
./deploy-test.sh就能发布了，记得把deploy-test.sh中的分支改成自己的分支并把自己的分支推到远程分支上。


*/
