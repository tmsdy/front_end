import React from 'react'

export default (props) => {
    return (
        <div>
            {
                props.children //保证传什么就返回什么
            }
        </div>
    )
}