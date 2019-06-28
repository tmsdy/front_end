/*

挂在window上，然后iframe里面用这里的导致内存泄漏
因为这里引用了this

解决：在iframe加载好时候直接挂在iframe的window上


*/
window[this.randomObj.del] = (that) => {
    this.module_del(that)
}
window[this.randomObj.toPic] = (that) => {
    this.getPic(that) // 打开浏览图片
}
window[this.randomObj.edit] = (that) => {
    let root = $(that).closest('.moduleItem')

    this.editingDomArr = $(root[0].children[0])

    this.editCurrentModel(root)
}
