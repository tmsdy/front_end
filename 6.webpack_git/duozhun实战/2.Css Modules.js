/*

* 1.webpack中配置开启：css?modules&localIdentName=[name]__[local]-[hash:base64:5]
加上 modules 即为启用，localIdentName 是设置生成样式的命名规则。

* 2.CSS Modules 只会转变类选择器，所以这里的属性选择器不需要添加 :global

参考：
  1.CSS Modules 详解及 React 中实践：https://github.com/camsong/blog/issues/5
*/