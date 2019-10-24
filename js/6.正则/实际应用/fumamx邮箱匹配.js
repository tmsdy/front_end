// let re = /^[a-zA-Z0-9\.]{2,17}(-*)@[a-z0-9\.]{2,15}\.(com|cn|ru)$/
let re = /^[a-zA-Z0-9_\.\-]{1,17}(-*)@[a-zA-Z0-9_\.\-]{2,15}\.[a-zA-Z]{2,5}$/

console.log(re.test('amp-@mail.ru'))
console.log(re.test('amp-1@mail.ru'))
console.log(re.test('1@mail.ru'))
console.log(re.test('1_@mail.ru'))
console.log(re.test('amp@mail.ru'))
console.log(re.test('amp@mail.ru'))
console.log(re.test('dena@fumasoft.com'))
console.log(re.test('xh03@chinawhxh.com'))
console.log(re.test('erginotomotiv@gmail.com'))
console.log(re.test('qj.zheng@hisoar.com'))
console.log(re.test('quanshi@service.quanshi.com'))




