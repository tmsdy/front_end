/*
toBe()----测试具体的值
toEqual()----测试对象类型的值
toBeCalled()----测试函数被调用
toHaveBeenCalledTimes()----测试函数被调用的次数
toHaveBeenCalledWith()----测试函数被调用时的参数
toBeNull()----结果是null
toBeUndefined()----结果是undefined
toBeDefined()----结果是defined
toBeTruthy()----结果是true
toBeFalsy()----结果是false
toContain()----数组匹配，检查是否包含
toMatch()----匹配字符型规则，支持正则
toBeCloseTo()----浮点数
toThrow()----支持字符串，浮点数，变量
toMatchSnapshot()----jest特有的快照测试
.not.+matcher，eg. .not.toBe()----前面加上.not就是否定形式
*/
test('测试各种断言语句', () => {
  const p1 = { name: 'feifei' }
  // expect(p1).toBe({ name: 'feifei' }) //不通过因为地址不一样
  expect(p1).toEqual({ name: 'feifei' }) //通过，只匹配内容

// 真假和not
  const a = 1
  expect(a).not.toBeFalsy(); //希望a不是假的，和expect(a).toBeTruthy()一样效果

// 数字
  const num = 9
  expect(num).toBeGreaterThan(5) //希望比5大，还有toBeLessThan，还有更复杂的自己查
  expect(0.1+0.2).toBeCloseTo(0.3) //用于看数字是不是很相近

// String
  const url = 'http://www.feifei.com'
  expect(url).toMatch('feifei') //希望包含'feifei'

// 数组
  const arr = ['feifei', 'fangfang', 'yuanyuan']
  expect(arr).toContain('feifei') //期望数组包含'feifei'

//异常
  const throwNewErrorFunc = () => {
    throw new Error('error')
  }
  expect(throwNewErrorFunc).toThrow()

})