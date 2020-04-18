let time = '{"beginTime":"2020-04-17","bizCode":null,"endTime":"2020-04-17","launchForever":false,"serviceProvider":null,"showTags":null,"solutionCode":null,"topAppKey":null,"topCompanyName":null}'
let res = JSON.parse(time)
// console.log(typeof res, res.beginTime, res.endTime)

let re = /^[\w\u4e00-\u9fa5]+$/g
// console.log(re.test('DZ_达摩盘定向我创建的人群DZ竞品高客单_板休潜客_电商部'))
let str = 'DZ_达摩盘精选-定制人群：店铺粉丝非会员'
let str2 = 'DZ_达摩盘精选店铺粉丝非会员'
console.log(str2.match(/[\w\u4e00-\u9fa5]+/g).join(''))

let arr = [true, false, false]
console.log(arr.every(item => item))

let matrixPrice = [
  {
    adzoneName: "无线_流量包_网上购物_手淘app_手淘焦点图",
    adzoneId: 34492608,
    settleMinPrice: 0.2,
    bidPrice: "1"
  }, {
    adzoneName: "PC_流量包_网上购物_淘宝首页焦点图",
    adzoneId: 34502344,
    settleMinPrice: 0.2,
    bidPrice: "1"
  },
  {
    adzoneName: "无线_天猫_app首页焦点图2最新",
    adzoneId: 108327200025,
    settleMinPrice: 0.1,
    bidPrice: "1"
  }
]
let adzoneName = matrixPrice.reduce((prev, cur) => {
  return {
    adzoneName: prev.adzoneName + '，' + cur.adzoneName
  }
})
console.log(adzoneName.adzoneName)