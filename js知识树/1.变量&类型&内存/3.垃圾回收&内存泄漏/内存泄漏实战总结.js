/*

1.let that = this
    return new Promise(function (resolve, reject){ that... }
改成：return new Promise( (resolve, reject) => { this... }

2.函数方法挂在window上，然后iframe里面用这里的导致内存泄漏,因为这里引用了this
解决：在iframe加载好时候直接挂在iframe的window上
window[this.randomObj.del] = (that) => {
    this.module_del(that)
}

3.

*/