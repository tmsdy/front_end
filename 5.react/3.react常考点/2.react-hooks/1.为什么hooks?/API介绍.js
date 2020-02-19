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

* 2.useCallback优化：接收一个内联回调函数参数和一个依赖项数组（子组件会用到父组件的值），useCallback 会返回该回调函数的 memoized 版本，该回调函数仅在某个依赖项改变时才会更新。一般用于主线程耗时长的任务(大dom diff计算等)
有没有后面的依赖项数组很重要，否则还是会重新渲染。可以缓存耗费性能的计算让渲染更快
const addClick = useCallback(()=>{
    setNumber(number+1);
},[number])

* 3.useMemo优化：把创建函数和依赖项数组作为参数传入 useMemo，它仅会在某个依赖项改变时才重新计算 memoized 值。这种优化有助于避免在每次渲染时都进行高开销的计算
 有没有后面的依赖项数组很重要，否则还是会重新渲染，如果后面的依赖项数组没有值的话，即使父组件的 number 值改变了，子组件也不会去更新
const data = useMemo(()=>({number}),[]);

3.useRef: 是React.createRef的增强

4.useSelector+useDispatch 发送action和取state

5.useState和useReducer

*/