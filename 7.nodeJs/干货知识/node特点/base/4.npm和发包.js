/*
npm: node package manager
全局安装: 加-g，默认的安装路径能用npm root -g看到
  不是加入环境变量而是在npm目录下有映射
nvm: 切换node版本的，
nrm：切换node源管理工具registry
  显示所有可用源：nrm ls
  用某个源：nrm use xxx
  测试各个源的时间：nrm test

本地安装：
npm init -y 一键生成

发布包：
1.先切到npm的源：nrm use npm
2.包名不能和已有的一致
3.入口文件，做整合用的
4.注册npmjs的账号，新用户需要校验邮箱，npm addUser，有就是登录没有就是注册
发布：npm publish,名字就是package.json里面的name

*/