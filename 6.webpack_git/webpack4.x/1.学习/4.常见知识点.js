/*

* 1.module、chunk、bundle
module：每个文件对应一个生成的module
chunk：根据文件引用关系生成chunk，一般来说一个入口对应一个chunk，但是如果加入了对chunk的split分割的话，还是会分割成多个chunk的，然后多个chunk对应多个打包出来的bundle文件

* 2.打包的[name]是根据entry配置来的，单入口默认是main



*/