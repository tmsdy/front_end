// 1.乱码如何转换问题
let str = '鍒楄〃涓€濇柊鍔垮姏鍛ㄤ細鍦洪珮娲荤洿鎾亸濂戒汉缇も€滃凡缁忓垹闄ゆ垨杩囨湡鎴栬€呮棤鏉冮檺锛岃绉婚櫎鍚庡啀鏂板缓'
// 解决：不要请求加responseType: 'blob'
// 整治各种乱码：http://www.mytju.com/classcode/tools/messycoderecover.asp

// 2.hash前加时间戳页面就会刷新，不会有注入js的干扰了
location.href = `
  https://zuanshi.taobao.com/index_smart.jsp?file=index_smart.jsp&timeStr=${+new Date}#!/crab/proxy/shop?alias=shop
  `

// 3.正则不要存成变量，不然同样的字符串test的结果可true可false左右横跳

// 4.jquery做鼠标移入移出的事件委托：https://blog.csdn.net/qq_36358940/article/details/76317140

// 5.react中用antd样式影响了，用css modules解决，配置下css-loader就行
"css-loader?modules&localIdentName=[path][name]-[local]-[hash]',"