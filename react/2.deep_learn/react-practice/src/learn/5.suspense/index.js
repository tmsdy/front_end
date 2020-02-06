import React, { Suspense, lazy } from 'react'
// 异步加载lazy。js
const LazyComp = lazy(() => import('./lazy.js'))

let data = ''
let promise = ''
function requestData() {
    if (data) return data
    if (promise) throw promise
    promise = new Promise(resolve => {
        setTimeout(() => {
            data = '请求到的数据'
            resolve()
        }, 2000)
    })
    throw promise
}

function SuspenseComp() {
    const data = requestData()

    return <p>{data}</p>
}
// Suspense：渲染时有异步操作的显示，当异步操作完成再显示组件这样，暂时只支持lazy
// Suspense会等它里面所以的组件都加载完成后才去把fallback去掉
export default () => (
    // 没有data的时候走fallback，有就走SuspenseComp的data
    <Suspense fallback="loading data">
        <SuspenseComp />
        {/* <LazyComp /> */}
    </Suspense>
)
