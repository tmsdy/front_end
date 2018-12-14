import { Commit, Dispatch } from 'vuex'
import Moment from 'moment'
import { Http } from '@/plugins/http'
import flaw from './flaw'
import score from './score'

// initial state
const states = {
  date: new Date(),
  productivityScore: 0,
  runningHours: 0,
}

// getters
const getters = {}

// mutations
const mutations = {
  setDateTime(state: typeof states, date: Date) {
    state.date = date
  },
  setScore(state: typeof states, score: number) {
    state.productivityScore = score
  },
  setRunningHours(state: typeof states, runningHours: number) {
    state.runningHours = runningHours
  },
}

// actions
const actions = {
  refreshStatus({ dispatch }: { dispatch: Dispatch }) {
    dispatch('fetchMachineStatus')
    dispatch('flaw/fetchFlawData')
  },
  fetchMachineStatus({
    commit,
    rootState,
  }: { commit: Commit;rootState: any }) {
    return new Promise((resolve, reject) => {
      const url = `/mes/factory/${rootState.factory.id}/machine-running-status`
      const params = {
        date: Moment(rootState.productivity.date).format('YYYYMMDD'),
      }
      Http.get(url, { params: params })
        .then(({ data }) => {
          commit('setRunningHours', data.runningHours)
          commit('setScore', data.workingScoreInPercents)
          resolve()
        })
        .catch(e => {
          console.error(e)
          reject(e)
        })
    })
  },
}

export default {
  namespaced: true,
  modules: {
    flaw,
    score,
  },
  state: states,
  getters,
  actions,
  mutations,
}
