/*

EventBus注册事件，必须off，不然就内存泄漏了会持有this

*/

created() {
    this.$MXEventBus.on('sendeeTopage', this.tabDataCheck_cb)
}
beforeDestroy() {
    this.$MXEventBus.off('sendeeTopage', this.tabDataCheck_cb)
}
methods: {
        tabDataCheck_cb(data) {
            this.tabDataCheck(data.type, data)
        }
