const path = require('path');
const config = require('../../../config');

exports.webpackResolve = function (str) {
  if (typeof str === 'string') {
    return path.resolve(__dirname, str);
  } else {
    return path.resolve(__dirname);
  }
}

// res/img 下面的所有图片会根据图片大小处理成base64或cdn地址
// assets 下面的所有图片会根据图片大小处理成base64
exports.getUrlLoaderName = function (file, prodMode) {
  const splitStr = path.join('src', 'res', 'img')
  const fileArr = String(file).split(splitStr)
  if (prodMode && fileArr.length === 2) {
    const resPath = fileArr[1]
    const resSplit = resPath.slice(0, 1)
    const name = resPath.slice(1).split(resSplit).join('/')
    return config.default.cdnImgUrl + name
  } else {
    if (prodMode) {
      return 'images/[name]_[hash:6].[ext]'
    }
    return 'images/[name].[ext]'
  }
}

exports.getFontUrlLoaderName = function (file, prodMode) {
  const splitStr = path.join('src', 'res', 'font')
  const fileArr = String(file).split(splitStr)
  if (prodMode && fileArr.length === 2) {
    const resPath = fileArr[1]
    const resSplit = resPath.slice(0, 1)
    const name = resPath.slice(1).split(resSplit).join('/')
    return config.default.cdnFontUrl + name
  } else {
    if (prodMode) {
      return 'fonts/[name]_[hash:6].[ext]'
    }
    return 'fonts/[name].[ext]'
  }
}
