let href = 'https://zuanshi.taobao.com/index_smart.jsp#!/main1/index?alias=shop&stepIndex=3&from=zqt&subStepIndex=-1&campaignId=986210271&adgroupId=986492254&refresh=_20200325_143929'
const shopSelectCrowds = [
  '^http[s]://zuanshi\\.taobao\\.com/index_smart\\.jsp#\\!/main1/index\\?alias=shop&stepIndex=3&from=zqt'
]
console.log(href.match(shopSelectCrowds.join('|')))