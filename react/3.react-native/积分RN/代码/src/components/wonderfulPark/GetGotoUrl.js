export const pingbackBtn = ['firstbtn', 'secondbnr', 'thirdbnr', 'forthbnr'];
export const gamesPingbackBtn = [
  {block: '200100', rseat: 'firstgame'},
  {block: '200200', rseat: 'secondgame'},
  {block: '200300', rseat: 'thirdgame'},
  {block: '200400', rseat: 'forthgame'},
  {block: '200500', rseat: 'fifthgame'},
  {block: '200600', rseat: 'sixthgame'},
  {block: '200700', rseat: 'seventhgame'},
  {block: '200800', rseat: 'eighthgame'},
  {block: '200900', rseat: 'ninthgame'},
  {block: '201000', rseat: 'tenthgame'},
  {block: '201100', rseat: 'eleventhgame'},
  {block: '201200', rseat: 'twelfthgame'},
];
export const daojuPingback = ['firstsp', 'secondsp', 'thirdsp', 'forthsp', 'fifthsp', 'sixthsp', 'seventhsp', 'eighthsp', 'ninthsp', 'tenthsp'];
export const RULES = [ // 积分规则文案， 前端写死
  '参与积分游戏或活动，即可提升乐园等级，解锁热门福利！',
  '不同游戏中，排名靠前者，还可额外获得爱奇艺VIP卡等豪华奖品！',
  '已获奖品，可在“积分乐园-兑换记录”或“积分商城-我的收获”中查看。',
  '活动最终解释权归爱奇艺所有。',
]

export function getAuctionInfo(data) {
  const {
    start_time: startTime,
    end_time: endTime,
    bid_time_cost: bidTimeCost,
    result_time_cost: resultTimeCost,
    publish_time_cost: publishCost,
  } = data
  const roundTime = bidTimeCost + resultTimeCost + publishCost // 一轮的时间
  const now = Date.now()
  const nowStatus = Math.floor(((now - startTime) % (roundTime * 1000)) / 1000)
  const calculatePeriod = bidTimeCost + resultTimeCost // 计算结果的时间点
  const param = {}
  if(now < startTime) {
    param.state = 0 // 未开始
    param.time = (startTime - now) / 1000
    param.countTime = countdown(param.time)
    return param
  } else if(now > endTime) {
    param.state = -1 // 已结束
    param.time = (now - startTime) / 1000
    return param
  }
  if(nowStatus >= 0 && nowStatus <= bidTimeCost) {
    param.state = 1 // 出价中
    param.time = bidTimeCost - nowStatus
  } else if(nowStatus > bidTimeCost && nowStatus <= calculatePeriod) {
    param.state = 2 // 计算中
    param.time = calculatePeriod - nowStatus
  } else if(nowStatus > calculatePeriod && nowStatus <= roundTime) {
    param.state = 3 // 结果公布
    param.time = roundTime - nowStatus
  }
  param.countTime = countdown(param.time)
  return param
}

const formatTime = (time) => {
  return time > 9 ? time : `0${time}`
}

export function countdown(param) {
  const time = {}
  const HOUR = 60 * 60 * 1000
  const MINUTE = 60 * 1000
  const SECOND = 1000
  const date = param * 1000
  if(date >= HOUR) {
    time.hour = Math.floor(date / HOUR)
    time.hour = formatTime(time.hour)
    time.minute = Math.floor((date % HOUR) / MINUTE)
    time.minute = formatTime(time.minute)
    time.second = Math.floor((date % HOUR % MINUTE) / SECOND)
    time.second = formatTime(time.second)
  } else if(date >= MINUTE) {
    time.hour = '00'
    time.minute = Math.floor(date / MINUTE)
    time.minute = formatTime(time.minute)
    time.second = Math.floor((date % MINUTE) / SECOND)
    time.second = formatTime(time.second)
  } else {
    time.hour = '00'
    time.minute = '00'
    if(date === 0) {
      time.second = '00'
    } else {
      time.second = Math.floor(date / SECOND)
      time.second = formatTime(time.second)
    }
  }
  return time
}
