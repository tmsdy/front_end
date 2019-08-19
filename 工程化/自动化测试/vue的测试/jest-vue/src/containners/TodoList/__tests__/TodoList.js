import { shallowMount } from '@vue/test-utils'
import TodoList from '../TodoList.vue'
import Header from '../components/Header.vue'

describe('TodoList.vue', () => {
  it('TodoItem初始化时，todoList应该为空', () => {
    const wrapper = shallowMount(TodoList)
    const todoList = wrapper.vm._data.todoList
    expect(todoList.length).toBe(0)
  })
  it('监听到Header组件触发的addTodoItem事件时候给todoList加个TodoItem', () => {
    const wrapper = shallowMount(TodoList)
    const header = wrapper.find(Header)
    const content = 'feifei'
    header.vm.$emit('addTodoItem', content)
    const todoList = wrapper.vm._data.todoList
    expect(todoList.shift().content).toEqual(content)
  })
})
