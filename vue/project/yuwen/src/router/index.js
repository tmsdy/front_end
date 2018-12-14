import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/Index'
import TYindex from '@/pages/TYindex'
import MyMistakes from '@/pages/MyMistakes'
import ReadArticle from '@/pages/ReadArticle'
import ShangXi from '@/pages/ShangXi'
import Listen from '@/pages/Listen'
import Learn from '@/pages/Learn'
import Daka from '@/pages/Daka'
import Ceshi from '@/pages/Ceshi'
import BeforeLearn from '@/pages/BeforeLearn'
import Weekend from '@/pages/Weekend'
import Signup from '@/pages/Signup'
import Invite from '@/pages/Invite'
import ThreeLevel from '@/pages/ThreeLevel'
import Purchase from '@/pages/Purchase'
import ToPingtuan from '@/pages/ToPingtuan'
import Pingtuan from '@/pages/Pingtuan'
import Laugh from '@/pages/Laugh'
import TabIndex from '@/pages/TabIndex'
import EditMine from '@/pages/EditMine'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: MyMistakes
    },
    {
      path: '/ThreeLevel',
      name: 'ThreeLevel',
      component: ThreeLevel
    },
    {
      path: '/Index',
      name: 'Index',
      component: Index
    },
    {
      path: '/MyMistakes',
      name: 'MyMistakes',
      component: MyMistakes
    },
    {
      path: '/Listen',
      name: 'Listen',
      component: Listen
    },
    {
      path: '/Learn',
      name: 'Learn',
      component: Learn
    },
    {
      path: '/Purchase',
      name: 'Purchase',
      component: Purchase
    }
  ]
})
