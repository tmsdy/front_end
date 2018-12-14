import Moment from 'moment'
import { Commit } from 'vuex'
import { Http } from '@/plugins/http'

type FlowCountItem = {
  factoryId: number
  flawCount: number
  machineId: number
  machineName: string
}

// initial state
const states = {
  totalCount: 0,
  flawRawData: [] as FlowCountItem[],
}

// getters
const getters = {
  flawCount(state: typeof states): number {
    if (state.totalCount > 0) {
      const count = state.flawRawData.reduce(
        (accumulator, currentItem) => accumulator + currentItem.flawCount,
        0,
      )
      return count
    }
    return 0
  },
}

// mutations
const mutations = {
  setTotalCount(state: typeof states, count: number) {
    state.totalCount = count
  },
  setFlawRawData(state: typeof states, flawRawData: any) {
    state.flawRawData = flawRawData
  },
}

// actions
const actions = {
  fetchFlawData({ commit, rootState }: { commit: Commit; rootState: any }) {
    return new Promise((resolve, reject) => {
      const url = `/mes/factory/${rootState.factory.id}/flaw`
      const params = {
        date: Moment(rootState.productivity.date).format('YYYYMMDD'),
        limit: 99999,
      }
      Http.get(url, { params: params })
        .then(({ data }) => {
          commit('setTotalCount', data.totalCount)
          commit('setFlawRawData', data.flawCountItem)
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
