let href = 'https://zuanshi.taobao.com/index_smart.jsp#!/main1/index?alias=shop&stepIndex=3&from=zqt&subStepIndex=-1&campaignId=986210271&adgroupId=986492254&refresh=_20200325_143929'
const shopSelectCrowds = [
  '^http[s]://zuanshi\\.taobao\\.com/index_smart\\.jsp#\\!/main1/index\\?alias=shop&stepIndex=3&from=zqt'
]
// console.log(href.match(shopSelectCrowds.join('|')))
let hash = '#!/main1/index?alias=shop&stepIndex=3&dz_from=zqt&dz_pattern=one-many&subStepIndex=-1&campaignId=997176342&adgroupId=1007527822'

// console.log(getQueryString('dz_pattern'))
// console.log(hash.match(new RegExp("(^|&)dz_pattern=([^&]*)(&|$)", 'i'))[2])

function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", 'i')
  var res = hash.match(reg)
  return res[2] || null
}

let str = "[{'adgroupId':1007649875,'creativeIdList':[30291504640001,30312504010001,30312504020001,30295504530001,30280504880001,30348502130001,30316503650001,30373000860001,30344002380001,30294504470001]}]"
console.log(str.match("'adgroupId':"))

let arr = [1, 2, 3]
let plan = {
  planName: '默认的计划名', // 计划名
  unitList: [ // 单元列表
    {
      unitName: 'DZ_达摩盘精选-活动人群：新势力周会场高活直播偏好人群', // 单元名
      crowdsName: '达摩盘精选-活动人群：新势力周会场高活直播偏好人群', // 人群名
      crowds: [ // 人群信息
        {}
      ]
    }
  ]
}
/*
需要校验的
requestBody.formData

*/