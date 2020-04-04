let str = 'https://zuanshi.taobao.com/index_smart.jsp?mxredirectUrl=#!/main1/index?mxredirectUrl=&alias=shop&stepIndex=4&subStepIndex=-1&campaignId=1006777130&adgroupId=1006869145'

console.log(['https://zuanshi.taobao.com/index_smart.jsp', 'alias=shop&stepIndex=4'].every(item => {
  return str.includes(item)
}))
console.log(str.includes('https://zuanshi.taobao.com/index_smart.jsp'))
str

let str2 = '鍒楄〃涓€濇柊鍔垮姏鍛ㄤ細鍦洪珮娲荤洿鎾亸濂戒汉缇も€滃凡缁忓垹闄ゆ垨杩囨湡鎴栬€呮棤鏉冮檺锛岃绉婚櫎鍚庡啀鏂板缓'
console.log(decodeuri(str2))