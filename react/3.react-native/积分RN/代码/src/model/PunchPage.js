import {isIOS} from '@iqiyi/rn-utils'

import {askPunchVote, askPunch, getPunchDetail, getPunchHistory, getPunchLast, executeTask, getPunchResult} from '../api';
import {getCDNUrl} from '../constants/configs';
import {getObjectValueSafely, formatQipuData} from '../common/util'
import {showToast} from '../common/QYNativeBridge';
import {getPunchStatusFromStorage} from './PunchPageService';

// 接口请求公共参数
const COMMON_PARAM = {
  agentversion: global.CLIENT_INFO.appVersion,
  appver: global.CLIENT_INFO.appVersion,
  verticalCode: 'iQIYI',
  agenttype: isIOS ? '20' : '21',
  typeCode: 'point',
  srcplatform: isIOS ? '20' : '21',
}

function formatRankData(rank) {
  if(!rank.length) {
    return []
  }
  const _rank = []
  rank.forEach((item, index) => {
    _rank[index] = {
      nickName: getObjectValueSafely(item, 'nickname', ''),
      avatar: getObjectValueSafely(item, 'avatar', getCDNUrl('default_icon')),
      reward: getObjectValueSafely(item, 'reward', 0)
    }
  })
  return _rank
}
/**
 * 打卡详情接口
 */
export function fetchPunchDetail({userId = global.USER_INFO.userId}) {
  const params = parseInt(userId) ? {userId} : {}
  return getPunchDetail({params})
    .then(({punchedBefore, userVoteNumber, scorePool, votedBefore, recentVoteUsers, timestamp}) => {
      const recentUser = []
      recentVoteUsers.map((item) => {
        return recentUser.push(`${item.nickname}参与投票`)
      })

      if(votedBefore) {
        // 昨天已经投过票，今天进入页面打卡
        if(!punchedBefore) {
          getPunchStatusFromStorage().then((punchStatus) => {
            !punchStatus && askPunch({params});
          });
        } else {
          // 在view层showModal
        }
      } else {
        // 如果昨天没投票, 今天可以投票
      }


      return {
        punchedBefore, // 该用户是否已经打过卡
        userVoteNumber, // 该用户投票数
        scorePool, // 奖池分数
        votedBefore, // 用户昨天是否投过票
        recentVoteUsers: recentUser || [],
        timestamp
      }
    })
    .catch(() => {
      showToast('网络异常，请稍后再试')
    })
}


export function fetchPunchLast(userId = global.USER_INFO.userId) {
  const params = parseInt(userId) ? {userId} : {}
  return getPunchLast({params}).then(({topUsers, lastPunched, lastFailed}) => {
    return {
      topUsers: formatRankData(topUsers),
      lastPunched,
      lastFailed
    }
  })
}

export function askToVote({userId = global.USER_INFO.userId, nickname = ''}) {
  const params = {
    userId,
    nickname
  }
  return askPunchVote({params}).then(({voteSuccessfully, totalScore, userVoteNumber, totalVoteNumber, scorePool}) => {
    return {
      voteSuccessfully,
      totalScore,
      userVoteNumber,
      totalVoteNumber,
      scorePool
    }
  })
}

export function askToPunch({userId = global.USER_INFO.userId}) {
  const params = {
    userId
  }
  return askPunch({params}).then(({votedBefore, punchSuccessfully, punchedBefore, totalVoteNumber, scorePool, punchedNumber}) => {
    return {
      votedBefore,
      punchSuccessfully,
      punchedBefore,
      totalVoteNumber,
      scorePool,
      punchedNumber
    }
  }, () => showToast('打开失败'))
}

export function fetchTipsData() {
  const requestHeader = {
    task_code: 'qipu_page_punch',
    timestamp: Date.now(),
  };
  const requestBody = {
    qipu_page_punch: Object.assign({}, COMMON_PARAM, {userId: global.USER_INFO.userId}),
  }
  return executeTask(requestHeader, requestBody)
    .then((data) => {
      const _result = data.resource_container || []
      const result = formatQipuData([_result[0]])[0]
      const _recommond = formatQipuData([_result[1]])[0]
      const tips = []
      const recommond = []
      if(result.length) {
        result.forEach((item) => {
          tips.push(getObjectValueSafely(item, 'title.proper_title', ''))
        })
      }
      if(_recommond.length) {
        _recommond.forEach((item) => {
          recommond.push({
            pic: item.thumbnail_url,
            link: item.entity_url
          })
        })
      }
      return {
        tips,
        recommond
      }
    })
}

export function fetchPunchResult() {
  const params = {
    userId: global.USER_INFO.userId
  }
  // "reward": 981, //该用户瓜分的积分
  // "scorePool": 1910, //积分池
  // "punchSuccess": 3, //打开成功人数
  // "finished": true  //是否开奖完成，如果此值为false， 以上字段全为空
  return getPunchResult({params}).then(({reward, scorePool, punchSuccess, finished, timestamp}) => {
    return {
      reward,
      scorePool,
      punchSuccess,
      finished,
      timestamp
    }
  })
}

export function fetchPucnHistory({userId = global.USER_INFO.userId, offset = 0, limit = 30}) {
  const params = {
    userId,
    offset,
    limit
  }
  // "historyVotes": 6,  //历史参与投票数
  // "historyCost": 60,  //历史消耗积分
  // "historyRewards": 427, //历史获得奖励
  return getPunchHistory({params}).then(({total, historyVotes, historyCost, historyRewards, historyRecords}) => {
    const _historyRecord = []
    const STATUE = {
      0: 'wait', // 待打卡
      1: 'success', // 打卡成功
      2: 'fail', // 打卡失败
    }
    if(historyRecords.length) {
      historyRecords.map((item) => {
        return _historyRecord.push({
          ...item,
          statusCode: STATUE[item.status || '0'] || 'wait'
        })
      })
    }
    return {
      total,
      historyVotes,
      historyCost,
      historyRewards,
      historyRecords: _historyRecord
    }
  })
}
