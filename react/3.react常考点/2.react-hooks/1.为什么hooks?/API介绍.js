/*

API
1.生命周期：useEffect
    componentDidMount <=> useEffect(() => {} , [])
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