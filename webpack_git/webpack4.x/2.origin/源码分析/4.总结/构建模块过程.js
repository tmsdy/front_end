/*

从make开始：
1.分析入口文件，一个入口一个compilation.addEntry，compilation真正编译构建模块保存到Compilation上

2.addEntry里面调核心模块构建方法_addModuleChain：
    1）根据模块类型创建不同的模块工厂，ModuleFactory.create构建模块
    2）构建完成的模块用addModule(module)把模块加到compilation.modules里面
    3）然后走buildModule(module）对module再进行build，此时loader生效。
        1>每次buildModule都需要回调里面调processModuleDependencies来处理模块依赖
        2>buildModule里面调了每个module都有的build方法，build -> doBuild -> runLoaders

3.NormalModule是继承Module的，有自己的build方法

  封装了这个阶段compilation干的一系列的优化措施以及将解析后的模块转化为标准的webpack模块，输出备用

*/