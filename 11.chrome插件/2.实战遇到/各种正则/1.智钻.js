// 1.符合匹配的链接
let href = 'https://zuanshi.taobao.com/index_smart.jsp#!/main1/index?alias=shop&stepIndex=3&from=zqt&subStepIndex=-1&campaignId=986210271&adgroupId=986492254&refresh=_20200325_143929'
const shopSelectCrowds = [
  '^http[s]://zuanshi\\.taobao\\.com/index_smart\\.jsp#\\!/main1/index\\?alias=shop&stepIndex=3&from=zqt'
]
console.log(href.match(shopSelectCrowds.join('|')))

// 2.取url上某个参数值
let hash = '#!/main1/index?alias=shop&stepIndex=3&dz_from=zqt&dz_pattern=one-many&subStepIndex=-1&campaignId=997176342&adgroupId=1007527822'

console.log(getQueryString('dz_pattern'))
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", 'i')
  var res = hash.match(reg)
  return res[2] || null
}

// 3.自动过滤非数字、字母、下划线的
let str = 'DZ_达摩盘精选-定制人群：店铺粉丝非会员'
console.log(str.match(/[\w\u4e00-\u9fa5]+/g).join(''))