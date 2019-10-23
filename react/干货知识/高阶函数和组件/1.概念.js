高阶函数基本概念
// 1.以函数作为参数
setTimeout(() => {
    console.log(111);
}, 1000);

// 2.函数可以作为返回值输出
function foo(x){
    return function(){
        return x
    }
}

/*
高阶组件基本概念
1.接收一个组件作为参数并返回一个新组件的函数
2.是函数不是组件
3.多个组件都需要某个相同的功能，使用高阶组件减少重复实现

示例
1.react-redux中的connect
export default connect(mapStateToProps,mapDispatchToProps)(Header)

 */