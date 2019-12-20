/*

runLoaders(){
    ...
    iteratePitchingLoaders() //迭代执行loader
}
* module先通过loader编译成buffer，然后把buffer变成_source，_source被parser解析生成_ast,生成的_ast挂在module上，module处理完，然后根据遍历_ast识别其中是否有require或import引入的依赖，如果有的话，接着build依赖项的module。

parse生成ast：webpack用的是acorn，parser在构建模块的时候都挂在module上了。
ast = acorn.parse(code, parserOptions);

*/