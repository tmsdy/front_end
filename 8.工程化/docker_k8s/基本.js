/*

1.微服务运行在docker容器中，用k8s管理容器

2.目的：快速的进行持续集成、快速交付

3.浏览器 -> 前端集群 -> 后端集群 -> mySQL集群/Redis集群
只有都集群化了才具有高性能、高负载、高可用优点

4.docker: 轻量级、可移植、资源占用少。构建配置一次可以在任何地方跑

5.k8s
是什么: 基于容器技术的分布式架构领先方案，是google开源的容器编排引擎，支持自动化部署、大规模可伸缩、应用容器化管理
能做什么：
1）容器的自动化复制和部署。随时扩展或收缩容器规模，并提供负载均衡。方便持续集成自动部署
2）方便的容器升级
3）提供容器弹性，如果失效就替换它

*/