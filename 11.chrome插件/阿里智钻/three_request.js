let addPlanInfo = {
  tabId: 1104,
  url: "https://zuanshi.taobao.com/api/campaign/add.json?r=mx_2527",
  method: 'POST',
  requestBody: {
    formData: {
      autoDmc: ['1'],
      avgDmc: [''],
      bizCode: ['zszwShop'],
      campaignName: ["全店竞价推广_常规投放计划_20200401_141201"],
      constraintBid: ['none'],
      constraintValue: [''],
      csrfID: ["158632811028803300395790634853822"],
      dayBudget: ['333'],
      dmcType: ['1'],
      dynamicToken: ["224216204196196216204200428224456192476408444404"],
      launchAreaList: ["[{'code':1},{'code':19},{'code':532},{'code':39},{'code':68},{'code':92},{'code':109},{'code':52},{'code':165},{'code':125},{'code':145},{'code':184},{'code':212},{'code':120},{'code':234},{'code':255},{'code':279},{'code':294},{'code':333},{'code':351},{'code':357},{'code':393},{'code':406},{'code':368},{'code':417},{'code':438},{'code':461},{'code':488},{'code':508},{'code':471},{'code':463},{'code':577},{'code':599},{'code':576},{'code':531}]"],
      launchPeriodList: ["[{'dayOfWeek':'0111110','timeSpans':[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]},{'dayOfWeek':'1000001','timeSpans':[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]}]"],
      launchTime: ['{"beginTime":"2020-04-17","bizCode":null,"endTime":"2020-04-17","launchForever":false,"serviceProvider":null,"showTags":null,"solutionCode":null,"topAppKey":null,"topCompanyName":null}'],
      marketAim: ['8'],
      marketScene: ['901'],
      promotionEntity: ['{"type":"1","entityList":[]}'],
      promotionEntityList: ['[]'],
      solutionType: ['0'],
      speedType: ['1'],
      timeStr: ["1586331640670"],
    }
  },
  requestHeaders: [
    { name: 'Accept', value: 'application/json, text/javascript, */*; q=0.01' },
    { name: 'Sec-Fetch-Dest', value: 'empty' },
    { name: 'X-Requested-With', value: 'XMLHttpRequest' },
    { name: 'User-Agent', value: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36" },
    { name: 'Content-Type', value: 'application/x-www-form-urlencoded; charset=UTF-8' },
    { name: 'Sec-Fetch-Site', value: 'same-origin' },
    { name: 'Sec-Fetch-Mode', value: 'cors' }
  ],
  timestamp: 1586331640686
}

let addUnitInfo = {
  tabId: 1104,
  url: 'https://zuanshi.taobao.com/api/adgroup/add.json?r=mx_681',
  method: 'POST',
  requestBody: {
    formData: {
      adgroupName: ['全店竞价推广_20200330_1749'],
      adzoneIds: ['[34492608,34502344,108327200025]'],
      bizCode: ['zszwShop'],
      campaignId: ["1015991200"],
      cpaPrice: [''],
      cpcLimit: [''],
      crowds: [
        '[{"targetType":128,"crowdName":"达摩盘定向-我创建的人群：DZ竞品高客单_板休潜客_电商部","targetLabel":{"adgroupBindCrowdId":null,"bidPrice":null,"bindCrowd":true,"bizType":null,"campaignId":null,"createTime":"2017-01-10","crowdId":null,"dayBudget":null,"deleteCrowd":true,"discount":null,"id":115194,"isDefaultPrice":null,"labelDesc":"达摩盘定向","labelId":115194,"labelName":"我创建的人群","labelOptionMode":"OPTION","labelPriceMode":"OPTION_MATRIX","labelSourceType":"DYNAMIC_OPTION","labelValue":"{optionValue}","matrixPrice":[],"memberId":null,"optionCount":202,"optionGroups":null,"options":[{"bidPrice":null,"createTime":"2017-01-10","filter":null,"id":1003,"labelId":115194,"labelOptionSourceType":"DYNAMIC","labelOptionType":"CHECKBOX","matrixPrice":[],"optionDesc":null,"optionName":"DZ竞品高客单_板休潜客_电商部","optionValue":"5446411","parentOptionId":null,"properties":{"coverage":"200000","validateTime":"2020-07-01","dmpCrowdDescription":"DZ竞品高客单_板休潜客_电商部","enableTime":"2020-04-08","isRecommended":"false","scoreRank":"2.5","businessType":"34","_debug_from_source":"DYNAMIC"},"sortNum":null,"status":1,"updateTime":"2017-01-10","selected":true}],"priority":null,"productId":null,"properties":{"_dmp_option_group_id":"30427","optionSourceType":"DYNAMIC","_dmp_tag_id":"147445","businessType":"1,3,10,11,12,13,14,18,21,25,26,24,29,30,34,37,39,41,42,43,44,46,47,48,49,50,53,54,55,56,57,58,59,60,61,62,67,70,71,72,73,74,76,77,78"},"shopId":null,"sortNum":2,"status":1,"suggestPrice":null,"targetId":138,"targetType":128,"targetingDimension":null,"targetingId":138,"transId":null,"updateTime":"2017-07-26","videoId":null,"videoType":null,"tag":"","color":"#ff0000","selected":false},"matrixPrice":[{"adzoneName":"无线_流量包_网上购物_手淘app_手淘焦点图","adzoneId":34492608,"settleMinPrice":0.2,"bidPrice":"1"},{"adzoneName":"PC_流量包_网上购物_淘宝首页焦点图","adzoneId":34502344,"settleMinPrice":0.2,"bidPrice":"1"},{"adzoneName":"无线_天猫_app首页焦点图2最新","adzoneId":108327200025,"settleMinPrice":0.1,"bidPrice":"1"}],"bidPrice":""},{"targetType":65536,"crowdName":"流量智选","targetLabel":{"adgroupId":null,"bizCode":null,"campaignId":null,"labelDesc":"流量智选","labelId":115201,"labelName":"流量智选","labelPriceMode":"LABEL_MATRIX","labelValue":"10","optionGroups":null,"options":[{"bizCode":null,"optionDesc":null,"optionId":null,"optionName":"流量智选","optionValue":"{shopId}","properties":{"score":null,"uv":null,"rank":null},"serviceProvider":null,"showTags":null,"solutionCode":null,"status":null,"topAppKey":null,"topCompanyName":null}],"properties":{},"serviceProvider":null,"showTags":null,"solutionCode":null,"status":1,"targetCategoryNameList":null,"targetId":141,"targetType":65536,"topAppKey":null,"topCompanyName":null},"matrixPrice":[{"adzoneName":"无线_流量包_网上购物_手淘app_手淘焦点图","adzoneId":34492608,"settleMinPrice":0.2,"bidPrice":"1"},{"adzoneName":"PC_流量包_网上购物_淘宝首页焦点图","adzoneId":34502344,"settleMinPrice":0.2,"bidPrice":"1"},{"adzoneName":"无线_天猫_app首页焦点图2最新","adzoneId":108327200025,"settleMinPrice":0.1,"bidPrice":"1"}],"bidPrice":""}]'
      ],
      csrfID: ["158632811028803300395790634853822"],
      dynamicToken: ["224216204196196216204200428224456192484212208488"],
      targetFilterList: ['[]'],
      timeStr: ["1586331720323"]
    }
  },
  requestHeaders: [
    { name: 'Accept', value: 'application/json, text/javascript, */*; q=0.01' },
    { name: 'Sec-Fetch-Dest', value: 'empty' },
    { name: 'X-Requested-With', value: 'XMLHttpRequest' },
    { name: 'User-Agent', value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36' },
    { name: 'Content-Type', value: 'application/x-www-form-urlencoded; charset=UTF-8' },
    { name: 'Sec-Fetch-Site', value: 'same-origin' },
    { name: 'Sec-Fetch-Mode', value: 'cors' }
  ],
  timestamp: 1586331720330
}

let saveCreativeInfo = {
  tabId: 932,
  url: 'https://zuanshi.taobao.com/api/creative/bindAll.json?r=mx_2952',
  method: 'POST',
  requestBody: {
    formData: {
      bindCreatives: ["[{adgroupId:1009822236,creativeIdList:[30291504640001,30312504010001,30312504020001,30295504530001,30280504880001,30348502130001,30316503650001,30373000860001,30344002380001,30294504470001]}]"],
      bizCode: ['zszwShop'],
      csrfID: ['158632811028803300395790634853822'],
      dynamicToken: ['224216204196196216204200428224456192488460216192'],
      timeStr: ['1586331796824']
    }
  },
  requestHeaders: [
    { name: 'Accept', value: 'application/json, text/javascript, */*; q=0.01' },
    { name: 'Sec-Fetch-Dest', value: 'empty' },
    { name: 'X-Requested-With', value: 'XMLHttpRequest' },
    { name: 'User-Agent', value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36' },
    { name: 'Content-Type', value: 'application/x-www-form-urlencoded; charset=UTF-8' },
    { name: 'Sec-Fetch-Site', value: 'same-origin' },
    { name: 'Sec-Fetch-Mode', value: 'cors' }
  ],
  timestamp: 1586331796832
}

let planComplete = {
  tabId: 932,
  url: 'https://zuanshi.taobao.com/api/campaign/complete.json?r=mx_2952',
  method: 'PUT',
  requestBody: {
    formData: {
      bizCode: ['zszwShop'],
      campaignId: ['1016914994'],
      csrfID: ['158641006160303300395790634853822'],
      dynamicToken: ['224216204228220228200216428224460416204420396388'],
      timeStr: ['1586419310746']
    }
  },
  requestHeaders: [
    { name: 'Accept', value: 'application/json, text/javascript, */*; q=0.01' },
    { name: 'Sec-Fetch-Dest', value: 'empty' },
    { name: 'X-Requested-With', value: 'XMLHttpRequest' },
    { name: 'User-Agent', value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36' },
    { name: 'Content-Type', value: 'application/x-www-form-urlencoded; charset=UTF-8' },
    { name: 'Sec-Fetch-Site', value: 'same-origin' },
    { name: 'Sec-Fetch-Mode', value: 'cors' }
  ],
  timestamp: 1586418812565
}

export {
  addPlanInfo,
  addUnitInfo,
  saveCreativeInfo,
  planComplete
}