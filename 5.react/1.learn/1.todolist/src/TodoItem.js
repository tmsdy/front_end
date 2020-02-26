import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

export class TodoItem extends Component {
    constructor(props) {
        super(props)
        this.deleteItem = this.deleteItem.bind(this)
        this.state = {}
    }

    deleteItem() {
        let { item, deleteItem } = this.props
        let { test } = this.state
        console.log(test) // test123
        deleteItem(item.id)
    }

    // 父组件render子组件都render会有性能损失，在这里减少一些不必要的render
    shouldComponentUpdate(nextProps, nextState) {
        console.log('shouldComponentUpdate')
        if (nextProps.item.content !== this.props.content) {
            return true
        }
        return false
    }

    // 挂载组件时，会在render前执行；更新组件时，该静态方法会在shouldComponentUpdate前执行。
    static getDerivedStateFromProps(props, state) { // 静态方法拿不到this,应该把它设计成纯函数
        console.log('getDerivedStateFromProps', props)
        return {
            test: 'test123'
        }
        // 返回值将作为setState的参数，如果返回null，则不更新state，不能返回object 或 null 以外的值，否则会警告。
    }

    render() {
        console.log('render')
        let { item, children } = this.props
        return (
            <Fragment>
                <li >{item.content}<span className="item_delete" onClick={this.deleteItem}>删除</span></li>
                {children}
            </Fragment>
        )
    }
}
TodoItem.propTypes = { //传值类型校验
    item: PropTypes.object.isRequired,
    deleteItem: PropTypes.func
}
TodoItem.defaultProps = {
    item: {}
}

export default TodoItem
