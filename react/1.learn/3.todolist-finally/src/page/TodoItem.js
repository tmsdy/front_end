import React, { useMemo } from 'react'
export default (props) => {
    const { item, deleteItem } = props

    return (
        useMemo(() => { // 完全取代shouldComponentUpdate作用
            return <li >
                {item.content}
                <span
                    style={{ paddingLeft: 20, cursor: 'pointer' }}
                    onClick={() => { deleteItem(item.id) }}>删除</span>
            </li>
        }, [item.content])
    )
}

