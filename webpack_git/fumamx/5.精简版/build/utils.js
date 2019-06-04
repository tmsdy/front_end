const path = require('path')
const config = require('../config')
const packageConfig = require('../package.json')
const HappyPack = require('happypack')
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

const isProd = process.env.NODE_ENV === 'production'

const resolve = function(dir) {
    return path.join(__dirname, '..', dir)
}

const assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}

const createLintingRule = function(){
  return {
    test: /\.(js|vue)$/,
    use: 'Happypack/loader?id=eslint',
    enforce: 'pre',
    include: resolve('src'),
  }
}

const createNotifierCallback = function() {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}

// 多线程打包配置
const genHappyPacks = function () {
  let happyPacks = [
    new HappyPack({
      id:'babel',
      loaders: ['babel-loader?cacheDirectory'],
      threadPool: happyThreadPool
    }),
    new HappyPack({
      id: 'less',
      loaders: [
        'less-loader',
      ],
      threadPool: happyThreadPool
    })
  ]
  if(!isProd){
    happyPacks.push(
      new HappyPack({
        id: 'eslint',
        threadPool: happyThreadPool,
        use:[
          {
            loader: 'eslint-loader',
            options: {
              formatter: require('eslint-friendly-formatter'),
              emitWarning: !config.dev.showEslintErrorsInOverlay
            }
          }
        ],
      })
    )
  }
  return happyPacks
}

const dateFtt = function(fmt, date) { //时间格式化工具
  var o = {
      "M+": date.getMonth() + 1, //月份   
      "d+": date.getDate(), //日   
      "h+": date.getHours(), //小时   
      "m+": date.getMinutes(), //分   
      "s+": date.getSeconds(), //秒   
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
      "S": date.getMilliseconds() //毫秒   
  };
  if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

module.exports = {
  resolve,
  assetsPath,
  createLintingRule,
  createNotifierCallback,
  genHappyPacks,
  dateFtt
}
