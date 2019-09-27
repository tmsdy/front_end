import React from 'react'
import PropTypes from 'prop-types'
/*
实现了上下级组件之间灵活通信,一般一个组件最多用一个用多了就比较乱了，Consumer基本就不用了就用
*/
const MyContext = React.createContext('defaultVal') //子元素找不到provider时候的默认值

class Parent extends React.Component {
    state = {
        childContext: '123',
        newContext: '456',
    }

    getChildContext() {
        return { value: this.state.childContext, a: 'aaaaa' }
    }

    render() {
        return (
            <>
                <div>
                    <label>childContext:</label>
                    <input
                        type="text"
                        value={this.state.childContext}
                        onChange={e => this.setState({ childContext: e.target.value })}
                    />
                </div>
                <div>
                    <label>newContext:</label>
                    <input
                        type="text"
                        value={this.state.newContext}
                        onChange={e => this.setState({ newContext: e.target.value })}
                    />
                </div>
                {/* React.createContext(新API)，上层组件用Provider，下层组件在哪用到数据就用Consumer */}
                <MyContext.Provider value={this.state.newContext}>{this.props.children}</MyContext.Provider>
            </>
        )
    }
}

class Parent2 extends React.Component {
    // { value: this.state.childContext, a: 'bbbbb' }
    getChildContext() {
        return { a: 'bbbbb' }
    }

    render() {
        return this.props.children
    }
}

function Child1(props, context) {
    return <MyContext.Consumer>{value => <p>Child1 newContext: {value}</p>}</MyContext.Consumer>
}

Child1.contextTypes = {
    value: PropTypes.string,
}

class Child2 extends React.Component {
    render() { // 子组件就this.context就能拿到传进的数据了
        console.log(this.context) // { value: "123", a: "bbbbb"}
        return (
            <p>
                Child2 Context: {this.context.value} {this.context.a}
            </p>
        )
    }
}

// Child2.contextType = Consumer

Child2.contextTypes = {
    value: PropTypes.string,
    a: PropTypes.string, //取离的最近的Parent2的a
}
// childContextTypes 对下层所有组件都能用，影响比较大，数据一更新下层即便没用该数据也要被完整渲染一次，react17将弃用
Parent.childContextTypes = {
    value: PropTypes.string,
    a: PropTypes.string,
}

Parent2.childContextTypes = {
    a: PropTypes.string,
}

export default () => (
    <Parent>
        <Parent2>
            <Child1 />
            <Child2 />
        </Parent2>
    </Parent>
)
