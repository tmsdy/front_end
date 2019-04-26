import React from 'react'

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
    this.inputRef.current.value = 'ref get input'
  }

  render() {
    return <TargetComponent ref={this.inputRef} />
  }
}
