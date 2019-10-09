// import perf from './perf'
// perf.init((perfData) => {
//     console.log('perf init')
//     console.log(perfData)
// })

import errorCatch from './errorCatch'
errorCatch.init(errorInfo => {
    console.log('errorInfo', errorInfo)
})

import xhrHook from './xhrHook'

xhrHook.init((xhrInfo) => {
    console.log(xhrInfo)
})

throw new Error('抛出的错误')

try {
    console.log('try catch====')
    aaa = 'bbb' + 'ccc'
} catch (err) {
    // console.log(err)
    throw err
}