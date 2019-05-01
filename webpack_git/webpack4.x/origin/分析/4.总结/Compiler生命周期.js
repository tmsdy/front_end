/*

1.首先触发beforeRun钩子，绑定了读取文件的对象。
  接着是run：主要是处理缓存的模块，减少编译的模块，加速编译速度。
  之后进入Compiler.compile()的编译环节。

2.等Compiler.compile运行结束之后会回调run中名为onCompiled的函数，将编译后的内容生成文件
  里面shouldEmit判断是否编译成功，未成功则结束done，打印相应信息。成功则调用Compiler.emitAssets打包文件。  

beforeCompile：
  编译前的准备，创建ModuleFactory并绑定到创建的Compilation上，同时处理一些不需要编译的模块
make：
  分析入口文件，一个入口一个compilation.addEntry，compilation真正编译构建模块保存到Compilation上，
  compilation主要分析模块之间的依赖关系，ModuleFactory.create构建模块，构建完成之后开始seal(封装)，
  封装了这个阶段compilation干的一系列的优化措施以及将解析后的模块转化为标准的webpack模块，输出备用

3.构建完成后回到Compiler
compilation.finish：
  触发结束构建的钩子，收集每个模块构建产生的问题
compilation.seal：
  开始封装，优化依赖的hook、module的hook、Chunk的hook等
  优化结束后开始执行Compiler的回调函数，将格式化的js通过Template模板重新聚合在一起，然后回调Compiler生成文件
  
4.模块的发源地-moduleFactory
  干的2件事：
    1)匹配了相对应的parser，将parser配置成了专门用于当前模块的解析器将源码解析成AST模式
    2)创建generator用于生成代码也就是还原AST（这一块是模版生成的时候会用到）
    3)创建模块，构建模块的时候给他找到相映的loader，替换源码，添加相映的依赖模块，
      然后在模块解析的时候提供相应的parser解析器，在生成模版的时候提供相应的generator
Fatory提供了原料（options）和工具（parser），就等于将参数输给了自动化的机器
自动化的机器normalModule：
  build模块，并将源码变为AST语法树

*/