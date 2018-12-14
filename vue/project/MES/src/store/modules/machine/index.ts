import { Commit, Dispatch } from 'vuex'
import Moment from 'moment'
import { Http } from '@/plugins/http'
import overview from './overview'

// initial state
const states = {}

// getters
const getters = {}

// mutations
const mutations = {}

// actions
const actions = {}

export default {
  namespaced: true,
  modules: { overview },
  state: states,
  getters,
  actions,
  mutations,
}
