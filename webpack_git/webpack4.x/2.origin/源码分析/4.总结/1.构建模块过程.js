/*

从make开始：
1.分析入口文件，一个入口一个compilation.addEntry，compilation真正编译构建模块保存到Compilation上

2.addEntry里面调核心模块构建方法_addModuleChain：
    1）创建ModuleFactory，ModuleFactory.create递归依赖每个文件对应生成标准module模块
    2）buildModule(module）-> module.build -> doBuild -> runLoaders，loader生效，编译解析模块。每次buildModule遇到依赖的话递归buildModule(依赖文件module）-> ...

3.所有模块编译完成后，开始封装，生成代码

*/