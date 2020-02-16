/*

* 1.dom操作是昂贵的(1.DOM属性很多2.会引起重排3.JS频繁访问DOM会耗性能)

* 2.虚拟DOM
vnode核心定义就几个关键属性、标签名、数据、子节点等，用来映射到真实DOM的渲染，不需要操作DOM，轻量简单
vdom映射到真实的DOM需要经历VNode的create、diff、patch等过程（DOM变化的对比，放在JS层来做，提高重绘性能(哪块变了改哪块)），当dom改变会生成一个新的模拟DOM，和原来这个对比，只修改变化DOM节点

js运行效率高，渲染只会触发一次重排
{
    tag:'ul',
    attr:{
        id:'list'
    },
    children:[
        {
            tag:'li',
            attrs:{ className:'item' },
            children:['Item1']
        },
        {
            tag:'li',
            attrs:{ className:'item' },
            children:['Item2']
        },
    ]
}

*/