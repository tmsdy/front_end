import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue';
import store from '@/store';

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: '/',
      component: Home
    },
    {
      path: '/recomment',
      name: '/recomment',
      component: Home
    },
    {
      path: '/category',
      name: '/category',
      component: Home
    },
    {
      path: '/food',
      name: '/food',
      component: Home
    },
    {
      path: '/catemenu',
      name: '/catemenu',
      component: Home
    },
    {
      path: '/user',
      name: '/user',
      component: Home
    },
    {
      path: '/comment',
      name: '/comment',
      component: Home
    },
    {
      path: '/favorite',
      name: '/favorite',
      component: Home
    }
  ]
})

router.beforeEach((to, from, next) => {
  console.log(to);
  next();
  // 把to.name更新到store中
  // 因为我们调用的是commit方法，ts在这里只能监测到commit的约束，不能
  // 去监测 setRouteName 他的类型约束，所以这里就不能靠类型约束来实现什么了
  store.commit('setRouteName', to.name);
})

export default router;