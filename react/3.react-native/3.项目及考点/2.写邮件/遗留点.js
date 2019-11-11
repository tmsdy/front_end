/*

1.把那个personList单独拎出来先空闲请求到存起来

2.上传时候页面不断刷新，这个时候的优化
shouldComponentUpdate(nextProps: Props, nextState: State) {
    let { extraList } = this.state
    if (extraList.some(item => item.sentOff)) {
        return false
    }
    return true
}
* 这样确实能做到在上传文件时候不渲染整个邮件，但是子组件也不渲染进度条效果就没了

*/