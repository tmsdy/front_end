import React from 'react'

export default class RefDemo extends React.Component {
  constructor() {
    super()
    this.objRef = React.createRef()
    // 就是创造了个对象：{ current: null }，把它传给某个节点，在组件渲染完成后会把节点实例挂在这个current上
  }

  componentDidMount() {
    // console.log(`span1: ${this.refs.ref1.textContent}`)
    // console.log(`span2: ${this.ref2.textContent}`)
    // console.log(`span3: ${this.ref3.current.textContent}`)
    setTimeout(() => {
      console.log(this.objRef)
      this.refs.stringRef.textContent = 'string ref got'
      this.methodRef.textContent = 'method ref got'
      this.objRef.current.textContent = 'obj ref got' //这么调用就行了
    }, 1000)
  }

  render() {
    return (
      <div>
        <p ref="stringRef">span1</p>
        <p ref={ele => (this.methodRef = ele)}>span3</p>
        <p ref={this.objRef}>span3</p>
      </div>
    )
  }
}

// export default () => {
//   return <div>Ref</div>
// }
