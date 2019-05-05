import React from 'react'

// forwardRef是父组件来获取子组件的dom元素的

//函数组件没有实例，是pureComponent没有this。也就是不能在函数组件中使用ref
// const TargetComponent = props => <input type="text"/>

const TargetComponent = React.forwardRef((props, ref) => (
  <input type="text" ref={ref} />
))

export default class Comp extends React.Component {
  constructor() {
    super()
    this.inputRef = React.createRef()
  }

  componentDidMount() {
    console.log(TargetComponent)
    console.log(this.inputRef.current) //子组件
    this.inputRef.current.value = 'ref get input'
  }

  render() {
    return <TargetComponent ref={this.inputRef} />
  }
}
