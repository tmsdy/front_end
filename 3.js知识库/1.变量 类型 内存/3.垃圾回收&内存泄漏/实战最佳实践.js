/*
* 删掉父组件A，但是由于子组件B仍然存在所以A组件还是活在内存中。所以千万不要把this搞进闭包里面了，不然整个项目组件的内存都泄漏了。
* 1.闭包引this导致泄漏
let that = this
    return new Promise(function (resolve, reject){ that... }
改成：return new Promise( (resolve, reject) => { this... }

* 2.尽量不要在window上挂东西，window上挂的东西(全局变量)不会被浏览器回收的。
1）函数方法挂在window上，然后iframe里面用这里的导致引用this内存泄漏
window[this.randomObj.del] = (that) => {
    this.module_del(that)
}
解决：在iframe加载好时候直接挂在iframe的window上
2）其他挂载也不行：window.PinyinHelper window.PinyinFormat

* 3.event-bus注册的函数方法用了this,一定要在在beforeDestroy里销毁off掉它。

* 4.所有事件监听记得在组件销毁的时候去除它。还有像echart图表对象、地图Map对象等实例化后也要记得在组件销毁的时候remove掉。



*/