
/*

1.目前happypack 暂时不支持 vue-loader。所以只能在vue-loader内部搞一些事情。
vue 模板本身是通过三个部分来组成的。那么通过配置vue-loader的options部分，将js部分交由happypack处理

2.把js/css/less/eslint都用happyPack包一下，加共享线程池

3.happyPack直接处理css会导致vue中的scoped属性失效
只在vue-loader内部的css包一层就好了

*/