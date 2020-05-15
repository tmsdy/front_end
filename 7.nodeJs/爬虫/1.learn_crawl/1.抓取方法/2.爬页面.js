/*
一般爬页面：当页面是由服务端渲染的时候，我们需要爬取其中的信息就需要拿到返回的html用正取去提取
*/
let request = require('request');
let url = 'https://juejin.im/tag/%E5%89%8D%E7%AB%AF';
let fs = require('fs');
// 1.写入到tag.html看数据样子
// request(url, (err, response, body) => {
//   console.log(response.statusCode)
//   fs.writeFileSync('tag.html', body)
// })

// 2.写正则去提取数据
request(url, (err, response, body) => {
  let regexp = /class="title" data-v-\w+>(.+?)<\/a>/g;
  let titles = []
  body.replace(regexp, (matched, title) => {
    console.log(matched)
    titles.push(title)
  });
  // console.log(titles)
});