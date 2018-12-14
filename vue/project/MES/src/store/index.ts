import Vue from 'vue'
import Vuex from 'vuex'
import local from '@/utils/storage/local'
import user from '@/utils/user'
import c from '@/config'

import productivity from '@/store/modules/productivity'
import machine from '@/store/modules/machine'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    productivity,
    machine,
  },
  state: {
    factory: local.get(c.FACTORY) || { id: 0, name: '' },
    user: null,
  },
  getters: {},
  mutations: {
    setFactory(state, factory: { id: number; name: string }) {
      local.set(c.FACTORY, factory)
      state.factory = factory
    },
  },
  actions: {
    // func({commit}){}
  },
})
