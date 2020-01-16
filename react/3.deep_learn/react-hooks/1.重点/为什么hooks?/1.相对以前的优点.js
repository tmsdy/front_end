/*

1.复用有状态的组件很麻烦，之前得用render props和hoc模式来复用
缺点：会造成大量层级嵌套，hooks不会这样。

2.之前组件上面绑定方法得bind(this)或者箭头函数，hooks定义函数直接用。

3.hooks useState各种数据直接用


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