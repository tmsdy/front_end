/**
 * Created by liuzhimeng.
 * @date 2018/8/8
 * @description
 */

import serverConfig from '../../../server.config'

const renderData = {
  ...serverConfig,
  ruleList: [
    '为你支持的一方投票，得票更多方获胜',
    '参与人数越多，胜方可瓜分积分值越高',
    '开奖后3天内皆可领取积分，过期作废',
  ]
}

export default function (router) {
  router.get('/topicpk', (req, res, next) => {
    res.render('share/topicpk/View', renderData)
  })
}
