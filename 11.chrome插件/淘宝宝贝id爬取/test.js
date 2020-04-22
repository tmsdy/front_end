let url = 'https://underarmour.tmall.com/category-870096261-684949889.htm?spm=a1z10.5-b-s.w5001-14440465431.9.3cb56785EdPVyG&search=y&catName=%C4%D0%D7%D3%D4%CB%B6%AF&scene=taobao_shop#bd'
let url2 = 'https://underarmour.taobao.com/category-870096261-684949889.htm?spm=a1z10.5-b-s.w5001-14440465431.9.3cb56785EdPVyG&search=y&catName=%C4%D0%D7%D3%D4%CB%B6%AF&scene=taobao_shop#bd'

const profileSync = ['^http[s]://.*\\.tmall\\.com/*', '^http[s]://.*\\.taobao\\.com/*']
// console.log(Boolean(url.match(profileSync.join('|'))))
// console.log(Boolean(url2.match(profileSync.join('|'))))

let href = '//detail.tmall.com/item.htm?id=615966253103&rn=1419cf99c83ee434be65f5f8360f0014&abbucket=20'
let href2 = 'https://item.taobao.com/item.htm?ft=t&spm=a211oj.14348747.2199492660.ditem2.20e34aa9n90BJv&id=531924198299'


// console.log(href.match(/([&|?]id=)(\d+)/)[2])
// console.log(href2.match(/(id=)(\d+)/))

let itemRules = ['detail\\.tmall\\.com/item\\.htm?', 'item\\.taobao\\.com/item\\.htm?']
console.log(href.match(matchItem.join('|')))
console.log(href2.match(matchItem.join('|')))