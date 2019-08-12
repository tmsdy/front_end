/*

1.只要组件能渲染，第一次运行都能生成一个快照，只要DOM一变就能测到，适合测UI。如果接受变化输入u更新快照就行
expect(wrapper).toMatchSnapshot()

*/