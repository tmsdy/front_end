/*
https://juejin.im/post/5d548b83f265da03ab42471d
1.v-for 遍历必须为 item 添加 key，且避免同时使用 v-if
https://juejin.im/post/5aae19aa6fb9a028d4445d1a
（1）v-for 遍历必须为 item 添加 key
    在列表数据进行遍历渲染时，需要为每一项 item 设置唯一 key 值，方便 Vue.js 内部机制精准找到该条列表数据。当 state 更新时，新的状态值和旧的状态值对比，较快地定位到 diff 。
    不能用索引当key，因为如果中间插个数据，后面的没变却因索引变化而重新渲染了
（2）v-for 遍历避免同时使用 v-if
    v-for 比 v-if 优先级高，每一次小改变都遍历整个数组将会影响速度，必要的时候将遍历的数组搞成computed

2.Object.freeze冻结不需要监听改变的长列表

3.事件的销毁：
*Vue 组件销毁时，会自动清理它与其它实例的连接，解绑它的全部指令及事件监听器，但是仅限于组件本身的事件。
如果在 js 内使用 addEventListener 等方式是不会自动销毁的，我们需要在组件销毁时手动移除这些事件的监听，以免造成内存泄露
created() {
  addEventListener('click', this.click, false)
},
beforeDestroy() {
  removeEventListener('click', this.click, false)
}

4.vue-lazyload来懒加载图片

5.路由懒加载：单页面应用，可能会有很多的路由引入 ，这样打包后的文件很大，需要当路由被访问的时候才加载对应的组件
{ path: '/foo', component: () => import('./Foo.vue') }

6.
*/