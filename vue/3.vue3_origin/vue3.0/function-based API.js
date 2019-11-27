/*

1.原本vue的组件上各种方法插件等东西都是挂在this上的，写起来比较方便，但是不利于类型推导

mixins大量使用时候问题：
1）命名空间冲突
2）模板数据来源不清晰

2.function-based API
const App = {
    setup() {
        // data
        const count = value(0)
        // computed
        const plusOne = computed(() => conut.value + 1)
        // method
        const increment = () => { count.value++ }
        // watch
        watch(() => count.value * 2, v => console.log(v))
        // lifecycle
        onMounted(() => console.log('mounted!'))
        // 暴露给模板或渲染函数
        return { count }
    }
}
对比class API的优点
1）更好的TS类型推导支持
2）更灵活的逻辑复用能力
3）tree-shaking更友好
    都是从Vue里面import出来的，然后用到的才会被打包，大大缩减打包体积
4）代码更容易被压缩

对比react-hooks
同样的逻辑组合，复用能力
vue只调用一次，react是每次渲染都调用一遍
    1）符合JS直觉
    2）没有闭包变量问题
    3）没有内存/GC压力
    4）不存在内联导致自组件永远更新的问题


*/