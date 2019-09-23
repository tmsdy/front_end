/*
1.react路由：npm i react-router-dom
HashRouter: http://localhost:3000/#/admin/buttons
BrowserRouter(history API 用得多): http://localhost/admin/buttons

Route: path、exact、component、render
NavLink:一般用于菜单导航
Link：react-router提供渲染成a标签
Switch

1.加了exact只有精准匹配path才行，不加的话只有符合含有path就行
2.重定向：<Redirect to="/admin/home" />
编程式重定向: props.history.push('/home/')
3.组件传值取值：
<Route path="/list/:id" component={List} />
props.match.params.id



*/