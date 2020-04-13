const path = require('path')
const config = require('../config')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const packageConfig = require('../package.json')
const HappyPack = require('happypack')
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

const isProd = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProd
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap

const resolve = function (dir) {
  return path.join(__dirname, '..', dir)
}

const assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}

const cssLoaders = function (options) {
  options = options || {}

  const cssLoader = 'happypack/loader?id=css'

  const postcssLoader = {
    loader: 'postcss-loader',
  }

  function generateLoaders(loader) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push(`happypack/loader?id=${loader}`)
    }

    if (options.extract) {
      return [
        MiniCssExtractPlugin.loader,
        ...loaders
      ]
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
  }
}

const createLintingRule = function () {
  return {
    test: /\.(js|vue)$/,
    use: 'Happypack/loader?id=eslint',
    enforce: 'pre',
    include: resolve('src'),
  }
}

const styleLoaders = function (options) {
  const output = []
  const loaders = cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

const createNotifierCallback = function () {
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

// vueLoader配置
const vueLoaderConfig = function () {
  return {
    loaders: cssLoaders({
      sourceMap: sourceMapEnabled,
      extract: isProd
    }),
    cssSourceMap: sourceMapEnabled,
    cacheBusting: config.dev.cacheBusting,
    transformToRequire: {
      video: ['src', 'poster'],
      source: 'src',
      img: 'src',
      image: 'xlink:href'
    }
  }
}

// 多线程打包配置
const genHappyPacks = function () {
  let happyPacks = [
    new HappyPack({
      id: 'babel',
      use: [{ loader: 'babel-loader' }],
      threads: 5,
      threadPool: happyThreadPool
    }),
    new HappyPack({
      id: 'css',
      loaders: ['css-loader'],
      threads: 5,
      threadPool: happyThreadPool
    }),
    new HappyPack({
      id: 'less',
      loaders: ['less-loader'],
      threadPool: happyThreadPool
    })
  ]
  if (!isProd) {
    happyPacks.push(
      new HappyPack({
        id: 'eslint',
        threads: 5,
        threadPool: happyThreadPool,
        use: [
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

module.exports = {
  resolve,
  assetsPath,
  cssLoaders,
  createLintingRule,
  styleLoaders,
  createNotifierCallback,
  vueLoaderConfig,
  genHappyPacks
}
