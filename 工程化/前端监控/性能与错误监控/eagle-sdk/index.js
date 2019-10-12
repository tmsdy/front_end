// import perf from './perf'
// perf.init((perfData) => {
//     console.log('perf init')
//     console.log(perfData)
// })

// import errorCatch from './errorCatch'
// errorCatch.init(errorInfo => {
//     console.log('errorInfo', errorInfo)
// })

import xhrHook from './xhrHook'

xhrHook.init((xhrInfo) => {
    console.log(xhrInfo)
    if (/^[45]/.test(xhrInfo.status)) { //匹配4xx,5xx开头的http状态码
        console.log('错误信息', {
            status: xhrInfo.status
        })
    }
})

// throw new Error('抛出的错误')

// try {
//     console.log('try catch====')
//     aaa = 'bbb' + 'ccc'
// } catch (err) {
//     // console.log(err)
//     throw err
// }