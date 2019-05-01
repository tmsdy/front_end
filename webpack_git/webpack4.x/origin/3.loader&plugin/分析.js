/*

1.loader在compiler的那个生命周期中生效的？怎么生效的？
    NormalModule里面的loaderRunner，拿到loader，执行loader
loaderContext很重要，包含了跑loader所需的所有工具和材料
const loaderContext = this.createLoaderContext( resolver, options, compilation, fs);
    
2.loader是个函数，在转换资源的时候调用，给定的函数将调用loader API并通过this上下文访问


*/