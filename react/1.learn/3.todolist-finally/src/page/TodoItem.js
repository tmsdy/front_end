import React, { memo, Component, PureComponent } from 'react'

// export default memo((props) => {
//     const { item, deleteItem } = props
//     console.log('todoitem render', item.content)
//     return (
//         <li >
//             {item.content}
//             <span
//                 style={{ paddingLeft: 20, cursor: 'pointer' }}
//                 onClick={() => { deleteItem(item.id) }}>删除</span>
//         </li>
//     )
// }, (prevProps, nextProps) => prevProps.item.content === nextProps.item.content)

export default class TodoItem extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.item.content !== nextProps.item.content
    }

    render() {
        let { item, deleteItem } = this.props
        console.log('todoitem render')
        return (
            <li >
                {item.content}
                <span
                    style={{ paddingLeft: 20, cursor: 'pointer' }}
                    onClick={() => { deleteItem(item.id) }}
                >删除</span>
            </li>
        );
    }
}

