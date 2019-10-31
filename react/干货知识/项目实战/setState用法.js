// 1.setState的key是动态的
this.setState({
    [key]: obj.xxx
})

// 2.设置数组state最好的方法
// 加一项：
this.setState({
    extraList: [...this.state.extraList, extraItem]
})
// 修改一项：
this.setState({
    listData: listData.map((item, idx) => idx === index ? { ...item, name: "陈小坏" } : item),
    obj: obj,
})

// 3.state是异步的，要获取赋值后的state值可以在第二个函数参数里获取
this.setState({
    currentInputType
}, () => {
    if (currentInputType === 0) {
        this.closeCopyDark()
    }
})

// 错误用法
state = {
    orderList: [{
        productStatus: this.props.productStatus || 1,//这样里面再次赋值会导致再次setState多一次渲染
    }],
}

