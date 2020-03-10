import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import TodoList from '../TodoList'

Enzyme.configure({ adapter: new Adapter() })

it('start test', () => {
    let todo = shallow(<TodoList />) // 浅渲染，只渲染TodoList这一层的组件
    let container = todo.find("[data-test='container']")
    // console.log(todo.debug())
    // expect(container).toExist()
    expect(container).toHaveProp('title', 'test')
    expect(container.prop('title')).toBe('test')
})