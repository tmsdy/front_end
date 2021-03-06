
// 1.过去未来七天的日历：创建过去七天的数组，如果将代码中的减号换成加号，你将得到未来7天的数组集合
let dateList = [...Array(7).keys()].map(days => new Date(Date.now() - 86400000 * days));
// console.log(dateList)

// 2.生成随机ID：生成长度为11的随机字母数字字符串
console.log(Math.random().toString(36).substring(2))

// 3.获取URL的查询参数
let q = {}
'?foo=bar&baz=bing'.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => q[k] = v)
console.log(q)

// 4.数组乱序
let a = (arr) => arr.slice().sort(() => Math.random() - 0.5)
let b = a([1, 2, 3, 4, 5])
console.log(b)

// 5.生成随机十六进制代码 如：'#c618b2'
console.log('#' + Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, '0'));
