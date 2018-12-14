import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import App from './app.vue'
import routes from './route/routes'
import createStore from './store/store'

import './assets/styles/global.less'
import './assets/styles/footer.less'

Vue.use(VueRouter) ;
Vue.use(Vuex) ;

const store = createStore() ;

const router = new VueRouter({
  routes,
  mode:'history',
  scrollBehavior(to,from,savedPosition){//跳转页面要不要滚动
    // console.log(to,from)
    if(savedPosition){ //如果在一个页面滚到一个位置，跳转返回还是这个位置
      return savedPosition
    }else{
      return { x:0, y:0 }
    }
  }
})

store.registerModule('c',{ //动态注册一个新模块c，一般放异步加载的模块
  state:{
    text: 333
  }
})

store.watch((state) => state.count+1,(newCount)=>{ //watch store中的数据改变
  // console.log('new count:'+newCount)
})
// store.subscribe((mutation,state)=>{ //每次mutation被调用都会走这里
//   console.log(mutation.type)
//   console.log(mutation.payload)
// })
// store.subscribeAction((action,state)=>{ //每次action被调用都会走这里
//   console.log(action.type) ;
//   console.log(action.payload) ;
// })


router.beforeEach((to,from,next)=>{ //一般在这里做身份验证拦截跳转
  // console.log('beforeEach') ;
  next() ;
  // if(to.fullPath === '/app'){
  //   // next('/login') ;
  //   next({path:'/login'})
  // }else{
  //   next() ;
  // }
})
router.beforeResolve((to,from,next)=>{
  // console.log('beforeResolve')
  next() ;
})
router.afterEach((to,from)=>{
  // console.log('afterEach')
})

new Vue({
  el:"#app" ,
  router,
  store,
  render: (h) => h(App)
})
