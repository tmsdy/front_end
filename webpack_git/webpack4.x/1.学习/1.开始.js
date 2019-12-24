/*

* 1.npx：执行可执行文件，x是exe，可以直接运行node_modules/.bin目录下面的命令
npx webpack -> 执行的是.bin目录下的webpack文件
等同于
 "scripts": {
    "build": "webpack --mode production",
    "dev": "webpack-dev-server --open --mode development"， --open默认打开网页
  },

* 2.webpack-dev-server起个静态服务器，预览打包后的项目。打包的文件放内存里了。需要生成html这样才能访问看见
1）起服务生成一些文件向bundle.js注入websocket客户端和起的服务器通信
2）如果服务器文件改了，会立刻编译并通知浏览器刷新拿到最新的结果
devServer: {
    contentBase: './dist', 静态文件根目录
    port: 3000,  端口号，默认8080
    host: '0.0.0.0', 这样localhost和内网ip都能访问,方便手机访问内网ip来调试
    compress: true, 是否开gzip压缩
    overlay: {
        errors: true, 编译出错显示到网页
    },
    open:true , 默认打开网页
    hot: true, 无刷新热重载
}

*/