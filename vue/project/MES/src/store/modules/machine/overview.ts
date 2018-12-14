import Moment from 'moment'
import { Commit } from 'vuex'
import { Http } from '@/plugins/http'

// initial state
const states = {
  machineStatus: [],
}

// getters
const getters = {}

// mutations
const mutations = {
  setMachineStatus(state: typeof states, machineStatus: any) {
    state.machineStatus = machineStatus.concat(machineStatus)
  },
}

// actions
const actions = {
  fetchMachineStatus({
    commit,
    rootState,
  }: {commit: Commit, rootState: any}) {
    return new Promise((resolve, reject) => {
      const url = `/mes/factory/${rootState.factory.id}/machine-real-time-status`
      const params = {
        date: Moment(rootState.productivity.date).format('YYYYMMDD'),
      }
      Http.get(url, { params: params })
        .then(({ data }) => {
          commit('setMachineStatus', data || [])
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
  state: states,
  getters,
  actions,
  mutations,
}
