/*

EventBus注册事件，必须off，不然就内存泄漏了会持有this

*/
this.$MXEventBus.on('sendeeTopage', (data) => {
    this.tabDataCheck(data.type, data)
})
