let str1 = 'ZARA 新款 男装 刺绣中长衬衫外套 08062410505-tmall.com天猫'

let str2 = '盒马进口泰国金枕榴莲1粒装4-6斤金枕头整个带壳榴莲新鲜当季水果-tmall.com天猫'

console.log(str2.match(/(-[^-]+)$/))
// console.log(str1.replace(/-[\w\W]+$/, ''))
// console.log(str2.replace(/?=(-[\w\W]+$)/, ''))

let url = '//detail.tmall.hk/hk/item.htm?spm=a1z10.3-b-s.w4011-17039211475.51.551c312e4uE80X&id=565977423042&rn=d86fc511fca632389323892d36aeb11a&abbucket=20'
// console.log(url.match(/[\w\W]+\?/)[0])


let addBtnGroup = {
  123: {
    x: 200,
    y: 200,
    width: 40,
    height: 40
  }
}
for (item in addBtnGroup) {
  console.log(item)
}