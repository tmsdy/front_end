import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

export class TodoItem extends Component {
    constructor(props) {
        super(props)
        this.deleteItem = this.deleteItem.bind(this)
    }
    deleteItem() {
        let { item, deleteItem } = this.props
        deleteItem(item.id)
    }
    // 父组件render子组件都render会有性能损失，在这里减少一些不必要的render
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.item.content !== this.props.content) {
            return true
        }
        return false
    }
    render() {
        let { item } = this.props
        return (
            <Fragment>
                <li >{item.content}<span className="item_delete" onClick={this.deleteItem}>删除</span></li>
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
