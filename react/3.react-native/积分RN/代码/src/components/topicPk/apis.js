/**
 * Created by liuzhimeng.
 * @date 2018/9/18
 * @description 话题PK接口
 */

import {getAvailableScore, getMyTopicList, getTopicList, getTopicReward, voteTopic, getTopicInfo, getTopicViewCompleteVotes} from '../../api'

export const getList = (params = {}) => {
  const _params = {
    typeCode: 'point',
    offset: 0,
    limit: 10,
    getVoteNumberAtRunTime: true,
    ...params,
  }
  return getTopicList(_params)
    .then((data) => {
      // console.log('getTopicList', data)
      return data
    })
    .catch((err) => {
      // console.log('getTopicList', err.message)
      throw err
    })
}

export const getMyList = (params = {}) => {
  const _params = {
    typeCode: 'point',
    offset: 0,
    limit: 10,
    getVoteNumberAtRunTime: true,
    ...params,
  }
  return getMyTopicList(_params)
    .then((data) => {
      // console.log('getMyTopicList', data)
      return data
    })
    .catch((err) => {
      // console.log('getMyTopicList err', err.message)
      throw err
    })
}

export const setVoteTopic = (params = {}) =>
  voteTopic(params)
    .then((data) => {
      // console.log('setVoteTopic', data)
      return data
    })
    .catch((err) => {
      // console.log('setVoteTopic', err.message)
      throw err
    })

export const getReward = (params = {}) =>
  getTopicReward(params)
    .then((data) => {
      // console.log('getTopicReward', data)
      return data
    })
    .catch((err) => {
      // console.log('getTopicReward', err.message)
      throw err
    })

export const getAvailableReward = (params = {}) =>
  getAvailableScore(params)
    .then((data) => {
      // console.log('getAvailableScore', data)
      return !!data && {
        scores: data.scores,
        isAvailable: data.scores > 0,
      }
    })
    .catch((err) => {
      // console.log('getAvailableScore', err.message)
      throw err
    })

export const getTopickDetail = ({groupName, topicCode, ext = false, userId = global.USER_INFO.userId}) => {
  return getTopicInfo({groupName, topicCode, ext, userId}).then((data) => {
    return data
  })
}

export const fetchTopicViewCompleteVotes = ({topicCode, ext = false, userId = global.USER_INFO.userId}) => {
  return getTopicViewCompleteVotes({topicCode, ext, userId}).then((data) => {
    return data
  })
}
