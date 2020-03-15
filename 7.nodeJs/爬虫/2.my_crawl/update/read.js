/**
 * 爬取掘金的标签tags和文章articles
 */
const request = require('request-promise')
const { getOptions } = require('./utils')

const crawl_tags = async function (url) {
  let options = getOptions(url)

  return request(options).then($ => {
    let infos = $('.item .tag .info-box')
    let tags = []
    infos.each((index, info) => {
      let tagInfo = $(info)
      let href = tagInfo.children().first().attr('href')
      let image = tagInfo.find('div.thumb').first().data('src')
      let title = tagInfo.find('div.title').first().text()
      let subscribe = tagInfo.find('div.subscribe').first().text()
      let article = tagInfo.find('div.article').first().text()
      tags.push({
        title,
        image,
        href: `https://juejin.im${href}`,
        subscribe: Number(subscribe.match(/^(\d+)/)[1]),
        article: Number(article.match(/^(\d+)/)[1])
      })
    })
    return tags.slice(0, 2)
  })
}

// let tagUrl = 'https://juejin.im/subscribe/all'
// crawl_tags(tagUrl).then(tags => {
//   console.log(tags);
// })

const crawl_articles = async function (url) {
  let options = getOptions(url)
  return request(options).then(async ($) => {
    let articleTitles = $('.info-box .title-row .title').slice(0, 5)
    let articles = []
    // debugger
    //在forEach里each里不能使用await方法
    for (let i = 0; i < articleTitles.length; i++) {
      let article = $(articleTitles[i])
      let href = article.attr('href')
      let title = article.text()
      let user_id = href.match(/[^\/]+$/)[0]
      href = `https://juejin.im${href}`
      let detail = await articleDetail(href)
      articles.push({
        user_id,
        href,
        title,
        // content: detail.content,
        tags: detail.tags
      });
    }
    return articles
  })
}

async function articleDetail(url) {
  let options = getOptions(url)
  return request(options).then($ => {
    // let content = $('.article-content').first().html()
    let tagTitles = $('.tag-list .item .tag-title')
    let tags = []
    tagTitles.each((index, title) => {
      tags.push($(title).text())
    })
    return {
      // content,
      tags
    }
  });

}


let articleUrl = 'https://juejin.im/tag/%E5%89%8D%E7%AB%AF'
crawl_articles(articleUrl).then(articles => {
  console.log(articles)
})

module.exports = {
  crawl_tags,
  crawl_articles
}