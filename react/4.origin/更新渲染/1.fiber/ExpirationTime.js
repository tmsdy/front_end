/*

异步计算expirationTime，这个能让我们可以实用concurrentMode实现优先级更新
实际计算：((((currentTime - 2 + 5000 / 10) / 25) | 0) + 1) * 25
最终结果是以25为单位向上增加的，比如说我们输入10002 - 10026之间，最终得到的结果都是10525，但是到了10027的到的结果就是10550，这就是除以25取整的效果。
当几个setState之间的时间差很短的时候算出的expirationTime应该是一样的(不一样的话那任务优先级也就不一样就会多次更新)，这样就不会多次更新而影响性能了

expirationTime种类：
1.Sync模式：外部强制使用，优先级最高，创建完成后立马把它更新到DOM里面。用flushSync操作

2.异步模式：会有一些调度，有复杂操作在里面可能会被中断，低优先级500ms，高优先级50ms左右，一直被中断导致过期后面没执行的会立马执行

3.指定context


*/
