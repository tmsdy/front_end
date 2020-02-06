/*
* 1.static getDerivedStateFromProps：自组件需要父组件的props，但是又不能改props，这时候用

* 2.空节点：React.Fragment，效果和 <> </> 一样的

* 3.ConcurrentMode：该组件下的setState更新都是第一优先级的。react-dom里的flushSync可以提高setState优先级。
flushSync(() => {
    this.setState({ num: newNum })
})

* 4.Suspense：SuspenseComp组件中有异步获取数据，则先展示fallback内容，等异步数据拿到了再展示SuspenseComp内容
<Suspense fallback="loading data">
    <SuspenseComp />
</Suspense>

* 5.{ Provider, Consumer } = React.createContext，做上下层组件通信

* 6.

*/