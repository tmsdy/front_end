import { add, minus, multi } from "../src/math";

test('测试加法 3 + 7', () => {
  expect(add(3, 7)).toBe(10)
})

test('测试减法 5 - 2', () => {
  expect(minus(5, 2)).toBe(3)
})

test('测试乘法 3 * 7', () => {
  expect(multi(3, 7)).toBe(21)
})