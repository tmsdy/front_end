import { Commit } from 'vuex'
import { Http } from '@/plugins/http'
import { getTimeRange } from '@/utils/tools'
import Moment from 'moment'

type machineRunningStatus = {
  date: number
  runningHours: number | null
  workingScoreInPercents: number | null
}

/**
 * 自动补全数据
 * @param machineRunningStatusList
 * @param startDate
 * @param endDate
 */
function fulfillMachineRunningStatusList(
  machineRunningStatusList: machineRunningStatus[],
  startDate: Date,
  endDate: Date,
): machineRunningStatus[] {
  const result = []
  // const endDateStr = Moment(endDate).format('YYYYMMDD')
  const tmpDate = Moment(startDate)
  for (; !tmpDate.isAfter(endDate, 'days'); tmpDate.add(1, 'days')) {
    const tmpMachineRunningStatus = machineRunningStatusList.find(
      item => item.date === parseInt(tmpDate.format('YYYYMMDD')),
    )
    if (tmpMachineRunningStatus === undefined) {
      result.push({
        date: parseInt(tmpDate.format('YYYYMMDD')),
        runningHours: null,
        workingScoreInPercents: null,
      })
    } else {
      result.push(tmpMachineRunningStatus)
    }
  }
  return result
}

// initial state
const states = {
  machineRunningStatusList: [] as machineRunningStatus[],
}

// getters
const getters = {
  machineRunningStatusData(state: typeof states) {
    return state.machineRunningStatusList.map(item => [
      Moment(item.date, 'YYYYMMDD').format('YYYY/MM/DD'),
      item.workingScoreInPercents,
    ])
  },
}

// mutations
const mutations = {
  setMachineRunningStatusList(
    state: typeof states,
    machineRunningStatusList: machineRunningStatus[],
  ) {
    state.machineRunningStatusList = machineRunningStatusList
  },
}

// actions
const actions = {
  fetchMachineRunningStatus({
    commit,
    rootState,
  }: {commit: Commit; rootState: any}) {
    return new Promise((resolve, reject) => {
      const timeRange = getTimeRange(rootState.productivity.date, 30)
      Http.get(
        `/mes/factory/${rootState.factory.id}/machine-running-status-list`,
        {
          params: {
            startDate: Moment(timeRange.startDate).format('YYYYMMDD'),
            endDate: Moment(timeRange.endDate).format('YYYYMMDD'),
          },
        },
      )
        .then(({ data }) => {
          const fulfilledMachineRunningStatusList = fulfillMachineRunningStatusList(
            data,
            timeRange.startDate,
            timeRange.endDate,
          )
          commit(
            'setMachineRunningStatusList',
            fulfilledMachineRunningStatusList,
          )
          resolve()
        })
        .catch((e) => {
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
