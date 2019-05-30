'use strict'
const path = require('path')
const config = require('../config')
// const ExtractTextPlugin = require('extract-text-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const packageConfig = require('../package.json')
const HappyPack = require('happypack')

const isProduction = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap

const resolve = function(dir) {
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

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    if (options.extract) {
      return [
        // 'vue-style-loader',
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
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

const createLintingRule = function(){
  return {
    test: /\.(js|vue)$/,
    use: 'Happypack/loader?id=eslint',
    enforce: 'pre',
    include: [resolve('src'), resolve('test')],
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

// vueLoader配置
const vueLoaderConfig = function () {
  return {
    loaders: cssLoaders({
      sourceMap: sourceMapEnabled,
      extract: isProduction
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
const happyPackConfig = [
  new HappyPack({
    id:'babel',
    use:[
      {
        loader: 'babel-loader'
      }
    ]
  }),
  new HappyPack({
    id:'vue',
    use:[
      {
        loader: 'vue-loader',
        options: vueLoaderConfig
      }
    ]
  }),
  new HappyPack({
    id:'eslint',
    use:[
      {
        loader: 'eslint-loader',
        options: {
          formatter: require('eslint-friendly-formatter'),
          emitWarning: !config.dev.showEslintErrorsInOverlay
        }
      }
    ]
  })
]

module.exports = {
  resolve,
  assetsPath,
  cssLoaders,
  createLintingRule,
  styleLoaders,
  createNotifierCallback,
  vueLoaderConfig,
  happyPackConfig
}
