/*

1.第一次打包5分44秒

2.加happypack打包
  1）js和vue并行（第二次打包5分3秒）
  2）再和eslint并行（第三次打包3分46秒）

3.升级webpack4：
  1）第四次打包（7分49秒）
  原因：看了打包分析发现没有打包出vender打包前总共有40mb原来只是18mb
  解决：需要进行代码分割和加dll处理
  
4，webpack4加happyPack: js/css/less/eslint都包一层，
包了css：3m25s -> 2m53s
包了less: 2m53s -> 2m35s


*/