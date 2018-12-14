import Vue from 'vue'
import Router, { Route, RouteRecord } from 'vue-router'

import Factories from '@/views/Factories/index.vue'
import Frame from '@/views/Frame/index.vue'
import NotFound from '@/views/NotFound/index.vue'
import Password from '@/views/Password/index.vue'
import Productivity from '@/views/Productivity/index.vue'
import Score from '@/views/Productivity/score.vue'

import user from '@/utils/user'
import goto from '@/utils/goto'
import { getDateString } from '@/utils/datetime'

import c from '@/config'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: c.ROUTER_NAME_HOME,
      redirect: { name: c.ROUTER_NAME_PRODUCTIVITY },
    },
    {
      path: '/factories',
      name: c.ROUTER_NAME_FACTORIES,
      component: Factories,
    },
    {
      path: '/frame',
      name: c.ROUTER_NAME_FRAME,
      component: Frame,
      redirect: { name: c.ROUTER_NAME_PRODUCTIVITY },
      meta: {
        breadcrumb: {
          show: false,
        },
      },
      children: [
        {
          path: 'productivity',
          name: c.ROUTER_NAME_PRODUCTIVITY,
          component: Productivity,
          redirect: { name: c.ROUTER_NAME_SCORE },
          children: [
            {
              path: 'score',
              name: c.ROUTER_NAME_SCORE,
              component: Score,
              meta: {
                breadcrumb: {
                  label(routeRecord: RouteRecord, route: Route) {
                    return `${getDateString(route.query.date)}${route.name}`
                  },
                },
              },
            },
            {
              path: 'running-hours',
              name: c.ROUTER_NAME_RUNNING_HOURS,
              meta: {
                breadcrumb: {
                  label(routeRecord: RouteRecord, route: Route) {
                    return `${getDateString(route.query.date)}${route.name}`
                  },
                },
              },
              component: () =>
                import(/* webpackChunkName: "runningHours" */ '@/views/Productivity/runningHours.vue'),
            },
            {
              path: 'flaw',
              name: c.ROUTER_NAME_FLAW,
              meta: {
                breadcrumb: {
                  label(routeRecord: RouteRecord, route: Route) {
                    return `${getDateString(route.query.date)}${route.name}`
                  },
                },
              },
              component: () =>
                import(/* webpackChunkName: "flaw" */ '@/views/Productivity/flaw.vue'),
            },
          ],
        },
        {
          path: 'machine',
          name: c.ROUTER_NAME_MACHINE,
          redirect: { name: c.ROUTER_NAME_OVERVIEW },
          component: () =>
            import(/* webpackChunkName: "machine" */ '@/views/Machine/index.vue'),
          children: [
            {
              path: 'overview',
              name: c.ROUTER_NAME_OVERVIEW,
              component: () =>
                import(/* webpackChunkName: "overview" */ '@/views/Machine/overview.vue'),
            },
            {
              path: ':machineId',
              name: c.ROUTER_NAME_MACHINE_DETAILS,
              meta: {
                breadcrumb: {
                  label(routeRecord: RouteRecord, route: Route) {
                    return `${route.params.machineId} 号机器`
                  },
                },
              },
              component: () =>
                import(/* webpackChunkName: "details" */ '@/views/Machine/details.vue'),
            },
          ],
        },
        {
          path: 'manage',
          name: c.ROUTER_NAME_MANAGE,
          component: () =>
            import(/* webpackChunkName: "manage" */ '@/views/Manage/index.vue'),
        },
      ],
    },
    {
      path: '/password',
      name: c.ROUTER_NAME_PASSWORD,
      component: Password,
    },
    { path: '/404', name: c.ROUTER_NAME_404, component: NotFound },
    { path: '*', redirect: { name: c.ROUTER_NAME_404 } },
  ],
})

router.beforeEach((to, from, next) => {
  const token = user.getToken()
  if (token === '') {
    // unlogin
    // goto(c.URL_LOGIN)
    next()
  } else {
    // has login
    next()
  }
})

export default router
