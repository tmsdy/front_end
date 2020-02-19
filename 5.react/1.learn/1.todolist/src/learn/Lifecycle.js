import React, { Component } from 'react'

export default class Lifecycle extends Component {
  componentWillMount(){ //组件即将挂载到页面
    console.log('componentWillMount')
  }
  componentDidMount(){ //组件被挂载到页面
    console.log('componentDidMount')
  }
  // 从父组件接收参数，只要父组件render重新执行了这就会执行(第一次渲染不执行)
  componentWillReceiveProps(){
    console.log('componentWillReceiveProps')
  }
  shouldComponentUpdate(){ //组件被更新前执行
    console.log('shouldComponentUpdate')
    return true
  }
  componentWillUpdate(){//组件更新前，shouldComponentUpdate返回true后执行，false则不执行
    console.log('componentWillUpdate')
  }
  componentDidUpdate(){
    console.log('componentDidUpdate')
  }
  render() { //state和props改变就执行，也算声明周期函数
    console.log('Lifecycle render')
    return (
      <div>
        Lifecycle
      </div>
    )
  }
  componentWillUnmount(){
    console.log('componentWillUnmount')
  }
}
