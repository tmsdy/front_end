
// Promise.all: 多个请求同时，返回所有请求结果数组，一个失败就失败
let wake = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`${time / 1000}秒后醒来`)
    }, time)
  })
}

let p1 = wake(3000)
let p2 = wake(2000)

Promise.all([p1, p2]).then((result) => {
  console.log(result)       // [ '3秒后醒来', '2秒后醒来' ]
}).catch((error) => {
  console.log(error)
})

//   Promise.race
let p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 1000)
})

let p4 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('failed')
  }, 500)
})

Promise.race([p3, p4]).then((result) => { // 只返回最快的那个结果
  console.log(result)
}).catch((error) => {
  console.log(error)  // 打开的是 'failed'
})