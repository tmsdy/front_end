const cheerio = require('cheerio')

const getOptions = function (url) {
  return {
    url,
    transform(body) {
      return cheerio.load(body) // 加载响应体转成jquery对象
    }
  }
}

module.exports = {
  getOptions
}