const path = require('path');
const cwd = process.cwd();
const defaultPath = path.join(cwd, 'dest');
const entry = require('../build/webpack/src/entry');

module.exports = {
  default: {
    entry: entry,
    path: defaultPath,
    cdnImgUrl: 'https://statics-web.iqiyi.com/h5/integralh5/res/img/', // 图片cdn地址
    cdnFontUrl: 'https://statics-web.iqiyi.com/h5/integralh5/res/font/', // 字体cdn地址
  },
  dev: {
    env: require('./dev.env'),
    port: 3000,
    cssSourceMap: false,
    publicPath: '/',
  },
  test: {
    env: require('./test.env'),
    publicPath: '/',
  },
  prod: {
    env: require('./prod.env'),
    publicPath: '/',
  }
}
