import *  as API from './api';
import falseData from './falseData'

export const formatData = function (data) {
  let now = Date.now();
  if (now - data.start_time > 0 && now - data.end_time < 0) { // 话题进行中
    data['status'] = 0;
  } else if (now - data.start_time < 0) { // 话题未开始
    data['status'] = 1;
  } else if (now - data.end_time > 0) { // 话题已结束
    data['status'] = 2;
  }
  return data;
}

let setTopicStatus = function (data) {
  let now = new Date().getTime();
  if (now - data.start_time < 0) { // 话题未开始
    data['status'] = 0;
  } else if (now - data.start_time > 0 && now - data.end_time < 0) { // 投票时间
    data['status'] = 1;
  } else if (now - data.end_time > 0 && now - data.draw_time < 0) { // 投票结束到开奖时间
    data['status'] = 2;
  } else if (now - data.draw_time > 0 && now - data.reward_valid_time < 0) { // 开奖到领奖时间
    data['status'] = 3;
  } else if (now - data.reward_valid_time > 0) { //过了领取奖励有效时间
    data['status'] = 4;
  }
  return data;
}

export function getTopicList(params = {}) {
  const _params = {
    typeCode: 'point',
    offset: 0,
    limit: 10,
    getVoteNumberAtRunTime: true,
    ...params
  }
  return new Promise(function (resolve, reject) {
    API.getTopiList(_params).then((data) => {
      if (data.contents && data.contents.length) {
        for (let i = 0; i < data.contents.length; i++) {
          data.contents[i] = formatData(data.contents[i])
        }
      }
      resolve(data)
    }, () => {
      reject([])
    })
  })
}

export function getMyList(params = {}) {
  const _params = {
    typeCode: 'point',
    offset: 0,
    limit: 10,
    getVoteNumberAtRunTime: true,
    ...params
  }
  return new Promise(function (resolve, reject) {
    API.getMyList(_params).then((data) => {
      // false data
      // data = falseData
      if (data.contents && data.contents.length) {
        for (let i = 0; i < data.contents.length; i++) {
          data.contents[i] = formatData(data.contents[i])
        }
      }
      resolve(data)
    }, () => {
      reject([])
    })
  })
}

export function getTopicDetail(param = {}) {
  return new Promise(function (resolve, reject) {
    API.getTopiDetail(param).then((data) => {
      resolve(setTopicStatus(data));
    }, () => {
      reject([]);
    })
  })
}

export function topicVote(param = {}) {
  return new Promise(function (resolve, reject) {
    API.setTopicVote(param).then((data) => {
      resolve(data);
    }, () => {
      reject(null);
    })
  })
}

export function getUserInfo(param = {}) {
  return new Promise(function (resolve, reject) {
    API.getIntegralUserInfo(param).then((data) => {
      resolve(data);
    }, () => {
      reject(null);
    })
  })
}

export function getReward(param = {}) {
  return new Promise((resolve, reject) => {
    API.getScoreReward(param).then((data) => {
      resolve(data)
    }, err => {
      reject(err)
    })
  })
}
