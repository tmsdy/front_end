/*

k8s基本概念：
1）Master是主服务器，node是用于部署应用容器的服务器
2）Pod基本操作单元，也是应用运行的载体。整个k8s系统都是围绕着Pod展开的。比如如何部署运行Pod,如何保证Pod的数量、如何访问Pod等
3）Deployment: 定义来pod部署的信息
4）若干个pod副本组成一个service，对外提供服务
5）副本是指一个pod的多个实例
6）Namespace用于多租户的资源隔离。在测试环境中可以根据namespace划分成多套测试环境。默认有2个namespace:kube-system/default

*/
