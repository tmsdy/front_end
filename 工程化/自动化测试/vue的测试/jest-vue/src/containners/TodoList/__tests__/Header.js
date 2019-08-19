import { shallowMount } from '@vue/test-utils'
import { findTestWrapper } from '../utils/testUtils'
import Header from '../components/Header'
// 专门对Header做测试可以不用写describe了
// describe('Header.vue', () => {
// })
it('Header 样式改变做提示', () => {
  const wrapper = shallowMount(Header)
  expect(wrapper).toMatchSnapshot()
})

it('Header 包含input', () => {
  const wrapper = shallowMount(Header)
  const input = findTestWrapper(wrapper, 'input')
  expect(input.exists()).toBe(true)
})

it('Header 的input初始内容为空', () => {
  const wrapper = shallowMount(Header)
  const inputVal = wrapper.vm.$data.inputVal
  expect(inputVal).toBe('')
})

it('Header 的input内容变化，数据应该跟着变', () => {
  const wrapper = shallowMount(Header)
  const input = findTestWrapper(wrapper, 'input')
  input.setValue('feifei')
  expect(wrapper.vm.$data.inputVal).toBe('feifei')
})

it('Header 的input输入回车，没有内容的时候没有反应', () => {
  const wrapper = shallowMount(Header)
  const input = findTestWrapper(wrapper, 'input')
  input.setValue('')
  // 模拟触发input的enter键
  input.trigger('keyup.enter')
  expect(wrapper.emitted().addTodoItem).toBeFalsy() // 不该向外触发事件
})

it('Header 的input输入回车，有内容的时候向外触发事件，并清空input内容', () => {
  const wrapper = shallowMount(Header)
  const input = findTestWrapper(wrapper, 'input')
  input.setValue('feifei')
  // 模拟触发input的enter键
  input.trigger('keyup.enter')
  expect(wrapper.emitted().addTodoItem).toBeTruthy() // 需要向外触发事件
  expect(wrapper.vm.$data.inputVal).toBe('')
})
