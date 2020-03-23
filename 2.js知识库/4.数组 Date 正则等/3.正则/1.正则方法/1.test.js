/*

test : 正则去匹配字符串，如果匹配成功就返回真，如果匹配失败就返回假
用法 : 正则.test(字符串)
* 应用场景：注册的时候的手机号、邮箱等验证

*/
var re = {
  chinese: /[\u4e00-\u9fa5]/, //中文
  qq: /^[1-9]\d{4,11}$/,
  email: /^\w+@[a-z0-9]+(\.[a-z]+){1,3}$/, //邮箱
  id_card: /[1-9]\d{14}|[1-9]\d{17}|[1-9]\d{16}x/,//身份证
}

console.log(re.chinese.test('韩飞')) // true