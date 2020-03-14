/**
 * 读取远程接口的数据
 */
const request = require('request-promise')
const cheerio = require('cheerio')

exports.tags = async function (url) {
  let options = {
    url,
    transform(body) {
      return cheerio.load(body) // 加载响应体转成jquery对象
    }
  }

  return request(options)
}

let tagUrl = 'https://juejin.im/subscribe/all'