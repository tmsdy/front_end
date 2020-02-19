import React from 'react'

// React.Children提供可以操作改动props.children能力，用的少

function ChildrenDemo(props) {
    console.log(props.children)
    console.log(React.Children.map(props.children, c => [c, [c, c]]))
    return props.children
}

export default () => (
    <ChildrenDemo>
        <span>1</span>
        <span>2</span>
    </ChildrenDemo>
)
