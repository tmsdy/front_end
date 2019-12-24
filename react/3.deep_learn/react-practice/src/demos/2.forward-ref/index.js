import React from 'react'

// forwardRef是父组件来获取子组件的dom元素的

// const TargetComponent = props => <input type="text"/>
// 会出错的时候，这些时候可以用forwardRef，感觉用的比较少
// 1.用别的库提供的组件不知道是不是pure组件时
// 2.用redux的connect包装后的组件获取不了组件实例

// const TargetComponent = (props, ref) => { // 函数组件没有this，不能用ref
//     return (
//         <input type="text" ref={ref} />
//     )
// }
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
