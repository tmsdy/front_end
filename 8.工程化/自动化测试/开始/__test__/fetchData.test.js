import { fetchData, fetchData2, fetchData3 } from "../src/fetchData";

test('fetchData成功返回', (done) => {
  fetchData((data) => {
    // 这种回调式的异步代码，这样写是走不到里面代码测试就结束了。得用done来控制
    expect(data).toEqual({
      success: true
    })
    done()
  })
})

test('fetchData成功返回2', () => {
  return fetchData2().then(res => { //是Promise，前面要加return
      expect(res.data).toEqual({
        success: true
      })
    })
})

test('fetchData返回404', () => {
  //异常是可以的，但是正常返回不走这里也通过，得用
  expect.assertions(1) //要求下面的expect语法得执行一次才算通过
  return fetchData3().catch((e) => {
    // console.log(e.toString())
    expect(e.toString().indexOf('404') > -1).toBe(true)
  })
})