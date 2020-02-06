/*
* 1.fps & 屏幕刷新率
fps：frames per second，每一秒的帧数，一帧代表显示器显示的一张画面，显示器上的各种画面都是一帧一帧组成的。
    fps可以代表显示的流畅度，fps越大动画越流畅，一般浏览器的fps为60
屏幕刷新率：屏幕每秒能够显示图像的次数，单位为 hz，fps的值是小于等于屏幕刷新率的。比如显示器较好，屏幕刷新率可以达到120hz的话，
    那么fps最高也能达到120

* 2.window.requestAnimationFrame(func),接受一个函数作为参数，一定会在浏览器重绘前调用传入的回调函数
requestAnimationFrame(() => {
    console.log(123)
})
* 重绘前调的优点：当requestAnimationFrame运行在后台标签页或者隐藏的<iframe>里会被暂停调用以提升性能和电池寿命。

* 3.浏览器每帧的工作 & requestIdleCallback
    * 1）每帧的工作依次为：Run Task -> rAf(requestAnimationFrame的时间) -> Update Rendering -> idle time（空闲时间）    空闲时间会执行requestIdleCallback传入的idle callback。

    * 2）以60的fps为例，每帧时间1000 / 60 = 16.7ms，如果在这个时间内完成了前三个工作，那么就会产生空闲时间，如果每一帧都有空    闲时间，那么1s钟内60帧会有很多空闲时间（可以利用起来做一些不那么重要的任务）

*/