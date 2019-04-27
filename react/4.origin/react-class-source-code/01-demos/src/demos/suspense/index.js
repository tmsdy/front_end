import React, { Suspense, lazy } from 'react'

const LazyComp = lazy(() => import('./lazy.js'))

let data = ''
let promise = ''
function requestData() {
  if (data) return data
  if (promise) throw promise
  promise = new Promise(resolve => {
    setTimeout(() => {
      data = 'Data resolved'
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
export default () => (
  // 没有data的时候走fallback，有就走SuspenseComp的data
  <Suspense fallback="loading data">
    <SuspenseComp />
    <LazyComp />
  </Suspense>
)
