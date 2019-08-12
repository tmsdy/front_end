import { shallowMount } from '@vue/test-utils'
import Header from '../components/Header'
// 专门对Header做测试可以不用写describe了
// describe('Header.vue', () => {
// })
it('Header 包含input', () => {
  const wrapper = shallowMount(Header)
  const input = wrapper.find('[data-test="input"]')
  expect(input.exists()).toBe(true)
})

it('Header 的input初始内容为空', () => {
  const wrapper = shallowMount(Header)
  const inputVal = wrapper.vm.$data.inputVal
  expect(inputVal).toBe('')
})

it('Header 的input内容变化，数据应该跟着变', () => {
  const wrapper = shallowMount(Header)
  const input = wrapper.find('[data-test="input"]')
  input.setValue('feifei')
  expect(wrapper.vm.$data.inputVal).toBe('feifei')
})

it('Header 的input输入回车，没有内容的时候没有反应', () => {
  const wrapper = shallowMount(Header)
  const input = wrapper.find('[data-test="input"]')
  input.setValue('')
  // 模拟触发input的enter键
  input.trigger('keyup.enter')
  // console.log(wrapper.emitted())
  // console.log(Boolean(wrapper.emitted().addTodoItem))
  expect(wrapper.emitted().addTodoItem).toBeFalsy() // 不该向外触发事件
  // toBeFalsy
})
