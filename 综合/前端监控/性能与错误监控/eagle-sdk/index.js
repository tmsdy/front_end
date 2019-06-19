// import perf from './perf'
import errorCatch from './errorCatch'

// perf.init(()=>{
//     console.log('perf init')
// })
errorCatch.init((errorInfo)=>{
    console.log(errorInfo)
})

console.log('feifei 123')