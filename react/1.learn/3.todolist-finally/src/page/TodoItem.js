import React from 'react'

export default React.memo((props) => {
    const { item, deleteItem } = props
    console.log('todoitem render', item.content)
    return (
        <li >
            {item.content}
            <span
                style={{ paddingLeft: 20, cursor: 'pointer' }}
                onClick={() => { deleteItem(item.id) }}>删除</span>
        </li>
    )
}, (prevProps, nextProps) => prevProps.item.content === nextProps.item.content)

