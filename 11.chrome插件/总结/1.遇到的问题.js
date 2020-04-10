// 1.乱码如何转换问题
let str = '鍒楄〃涓€濇柊鍔垮姏鍛ㄤ細鍦洪珮娲荤洿鎾亸濂戒汉缇も€滃凡缁忓垹闄ゆ垨杩囨湡鎴栬€呮棤鏉冮檺锛岃绉婚櫎鍚庡啀鏂板缓'

// 2.hash前加时间戳页面就会刷新，不会有注入js的干扰了
location.href = `
  https://zuanshi.taobao.com/index_smart.jsp?file=index_smart.jsp&timeStr=${+new Date}#!/crab/proxy/shop?alias=shop
  `

// 3.正则不要存成变量，不然同样的字符串test的结果可true可false左右横跳
