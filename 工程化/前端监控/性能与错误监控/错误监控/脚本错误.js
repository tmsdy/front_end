/*
核心问题：
1.错误反解：线上的文件都是压缩后的，报错都在第一行第几千列，我们需要用sourceMap反解来获得真正出错的地方。
2.兼容性问题：chrome报的错有时有问题不大准确
3.跨域脚本情况：
    当加载自不同域的脚本中发生语法错误时,errorMessage始终是‘Script error.’，lineNumber 为0。通过在<script>使用crossorigin属行来规避这种个情况。

实现技术：
1.window.onerror可以捕获详细的错误信息
2.设置devtool: 'source-map'可以生成.map文件，上传这个.map文件给node，node用source-map和报错信息来反解出具体报错问题所在

实战遇到的问题：
1.window.onerror捕获不到vue的错误。
window.onerror只能捕获未处理的错误，如果错误被vue处理了，那你那根本就没法处理。
Vue用Vue.config.errorHandler来处理的,不过信息全混在stack里了，可以重写console.error来处理错误

2.开发环境压缩代码去掉sourcemap模拟会出现堆栈溢出
提高webpack-dev-server运行内存：https://blog.csdn.net/xiasohuai/article/details/86704392
UglifyJsPlugin有个sourceMap，如果prod开sourceMap，这个要为true

3.看vue-test测试项目学习new webpack.SourceMapDevToolPlugin(options)分离map文件
4.本地跑通了，上服务器请求报504请求时间超时。
1)服务正常，接口有问题。大概率是node的问题
2)不链接mysql的没问题,证明连mysql出问题了，最后发现上线该换成内网地址，我用的还是外网

扩展：
1.看线上node运行日志：pm2 log xxx(进程)





*/


