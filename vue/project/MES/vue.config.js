const path = require('path')

console.log('process.env.BUILD_TAG: ' + process.env.BUILD_TAG)

module.exports = {
  baseUrl:
    process.env.NODE_ENV === 'production'
      ? 'https://mes-cdn.hypereal.com/fe/' + (process.env.BUILD_TAG || '')
      : '',
  pages: {
    // 登录页面单独打包
    login: {
      entry: 'src/pages/login/index.ts',
      filename: 'login.html',
      title: 'Login Page',
      chunks: ['chunk-vendors', 'chunk-common', 'login'],
    },
    // 其他页面
    index: 'src/main.ts',
  },
  css: {
    loaderOptions: {
      stylus: {
        import: [
          path.join(__dirname, './src/common/stylus/index.styl'), // 全局变量文件
        ],
      },
    },
  },
  devServer: {
    host: '0.0.0.0',
    port: '9090',
  },
}
