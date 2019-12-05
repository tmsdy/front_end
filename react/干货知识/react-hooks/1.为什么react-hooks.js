/*

上层组件用Provider，下层组件在哪用到数据就用Consumer
const { Provider,Consumer } = React.createContext('defaultVal')
上层：<Provider value={this.state.newContext}>{this.props.children}</Provider>
下层：<Consumer>{value => <p>Child1 newContext: {value}</p>}</Consumer>

组件上面绑定方法不需要在写bind(this)了

shouldComponentUpdate可能会搞得循环更新

更便于函数式编程，中间件编程

API
1.生命周期：useEffect
    componentDidMount: useEffect(() => {} , [])
    useEffect(() => {
        * 每次更新走这里 componentDidUpdate
        return () => { // componentUnMounted
            console.log('unbind')
        }
    })

2.优化：useCallback/useMemo
可以缓存耗费性能的计算让渲染更快

3.useRef: 是React.createRef的增强

4.useSelector+useDispatch 发送action和取state

5.useState和useReducer

*/