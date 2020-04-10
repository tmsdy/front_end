// * 1.字符串数组转换成数组
let arr = "[1,2,3]"
console.log(eval(arr))

// * 2.字符串对象转对象
let time = '{"beginTime":"2020-04-17","bizCode":null,"endTime":"2020-04-17","launchForever":false,"serviceProvider":null,"showTags":null,"solutionCode":null,"topAppKey":null,"topCompanyName":null}'
let res = JSON.parse(time)
// * 注意json的标准格式key和value都必须加双引号而不是单引号；

