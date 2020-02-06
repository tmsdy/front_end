/*

* 1.React.memo：当类组件的输入属性相同时，可以使用 pureComponent 或 shouldComponentUpdate 来避免组件的渲染。现在，你可以通过把函数组件包装在 React.memo 中来实现相同的功能。
export default React.memo((props) => {
    const { item, deleteItem } = props
    return <li >{item.content}</li>
}, (prevProps, nextProps) => prevProps.item.content === nextProps.item.content)

* 2.

*/