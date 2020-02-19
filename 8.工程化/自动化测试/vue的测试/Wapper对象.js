/*

文档：https://vue-test-utils.vuejs.org/zh/api/wrapper/#exists
1.props: 拿到vm的props
wrapper.props(): { msg: 'feifei' }
wrapper.props('msg'): 'feifei'

2.设置vm 的 props 并强制更新
wrapper.setProps({ msg: 'hello' })

3.
shallowMount：浅渲染，只渲染当前组件而不渲染子组件，适合单元测试，性能高
mount：全部渲染，适合集成测试，性能相对低

4.exists：判断DOM是否存在
expect(wrapper.find('does-not-exist').exists()).toBe(false)
expect(wrapper.findAll('div').exists()).toBe(true)

5.trigger：手动触发DOM事件

6.emitted：有没有向外触发事件

*/