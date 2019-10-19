/*
1.初始state
 state = {
     orderList: [{
      productStatus: this.props.productStatus || 1,//这样里面再次赋值会导致再次setState多一次渲染
    }],
 }

2.设置数组state最好的方法
加一项：
this.setState({
    extraList: [...this.state.extraList, extraItem]
})
修改一项：
this.setState({
    listData: listData.map((item, idx) => idx === index ? {...item, name:  "陈小坏"} : item),
    obj: obj,
})

*/