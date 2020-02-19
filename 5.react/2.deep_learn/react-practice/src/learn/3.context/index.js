import React from 'react'
import PropTypes from 'prop-types'
/*
实现了上下级组件之间灵活通信,一般一个组件最多用一个用多了就比较乱了，Consumer基本就不用了就用
*/
const MyContext = React.createContext('defaultVal') //子元素找不到provider时候的默认值

class ParentProvider extends React.Component {
    state = {
        provideVal: '12345',
    }
    getChildContext() {
        return { value: this.state.provideVal }
    }
    render() {
        return (
            <>
                <div>
                    <label>provideVal:</label>
                    <input
                        type="text"
                        value={this.state.provideVal}
                        onChange={e => this.setState({ provideVal: e.target.value })}
                    />
                </div>
                {/* React.createContext(新API)，上层组件用Provider，下层组件在哪用到数据就用Consumer */}
                <MyContext.Provider value={this.state.provideVal}>{this.props.children}</MyContext.Provider>
            </>
        )
    }
}
function ChildConsumer(props, context) {
    console.log('子组件1渲染')
    return <MyContext.Consumer>{value => <p>ChildConsumer value: {value}</p>}</MyContext.Consumer>
}
ParentProvider.childContextTypes = { // 限定props要传value，不然报错
    value: PropTypes.string
}
ChildConsumer.contextTypes = {
    value: PropTypes.string
}

class ParentContext extends React.Component {
    getChildContext() {
        return { childContextVal: 'bbbbb' }
    }
    render() {
        return this.props.children
    }
}
class ChildContext extends React.Component {
    render() { // 子组件就this.context就能拿到传进的数据了
        console.log('子组件2拿到context并渲染', this.context)
        return (
            <p>
                ChildContext value: {this.context.childContextVal}
            </p>
        )
    }
}
ChildContext.contextTypes = {
    childContextVal: PropTypes.string
}
// * childContextTypes: 对下层所有组件都能用，影响比较大，数据一更新下层即便没用该数据也要被完整渲染一次，react17将弃用
ParentContext.childContextTypes = {
    childContextVal: PropTypes.string,
}

export default () => (
    <ParentProvider>
        <ParentContext>
            <ChildConsumer />
            <ChildContext />
        </ParentContext>
    </ParentProvider>
)
