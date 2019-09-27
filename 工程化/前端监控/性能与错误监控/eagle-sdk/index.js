// import perf from './perf'
// perf.init((perfData) => {
//     console.log('perf init')
//     console.log(perfData)
// })

import errorCatch from './errorCatch'

errorCatch.init(errorInfo => {
    console.log('errorInfo', errorInfo)
})

