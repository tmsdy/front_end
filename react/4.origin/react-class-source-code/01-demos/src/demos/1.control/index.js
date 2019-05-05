import React from 'react'
import ReactDOM from 'react-dom'

/*
实现双向数据绑定
    1.受状态控制的组件，必须要有onChange方法，否则不能使用 受控组件可以赋予默认值（官方推荐使用 受控组件）
*/

class App extends React.Component {

        constructor(){
            super();
            this.state = {
                val:'100',
                result:''
            }
        }

        handleChange = (e) =>{ //e是事件源
            let val = e.target.value;
            this.setState({val});
        }
        render(){
            let {val} = this.state
            return (<div>
                受控组件
                <input type="text" value={val} onChange={this.handleChange}/>
                {val}<br />
            </div>)
        }

}
export default App
