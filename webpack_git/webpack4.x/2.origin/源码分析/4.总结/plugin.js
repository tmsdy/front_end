/*

* 1.每个plugin类都需要有一个apply方法，传入compiler，然后可以给compiler赋予功能，然后把插件tap管接在某个钩子上，这样当钩子call/callAsync触发事件的时候就能触发了。可以tap到compiler的任意生命周期的钩子上。

* 2.因为plugin在webpack初始化的时候就触发了，但是一般tap的事件是需要在对应的触发时间点触发的。


*/