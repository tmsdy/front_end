import Todo from '../views/todo/todo.vue'
import subtodo from '../views/todo/subtodo.vue'
import Login from '../views/login/login.vue'


export default [
  {
    path: '/',
    redirect: '/todo'
  },
  {
    // path:'/todo/:todo_id' ,
    path:'/todo' ,
    props: true , //这样比用$route拿参数要好,解耦提高组件复用性
    // props:(route)=>({todo_id: route.query.a}) ,
    name:'todo' ,
    // component: Todo,
    component: ()=>import('../views/todo/todo.vue') ,//进入当前路由才加载
    meta:{
      title:'this is todo' ,
      description: 'todooooooo'
    },
    children:[
      {
        path:'/small' ,
        component: subtodo
      }
    ]
  },
  {
    path: '/login',
    component: Login
  }
]
