import { runCallback } from "../src/mock";

test('测试 runCallback', () => {
  // const func = () => {
  //   return 'hello'
  // }
  // expect(runCallback(func)).toBe('hello') //这样来期望func被调用过是不靠谱的
  const func = jest.fn()
  runCallback(func)
  expect(func).toBeCalled() //这样来期望func被调用过才靠谱
  console.log(func.mock) //调用详情
})