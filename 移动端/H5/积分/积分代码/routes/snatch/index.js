/**
 * 积分夺宝
 */
import {Router} from 'express'
import serverConfig from '../../server.config'
import recordController from './record/controller'
import detailController from './detail/controller'

const router = new Router()

const renderData = {
  ...serverConfig,
  ruleList: [
    '怎么夺宝成功？参与次数越多，中奖概率越大',
    '什么时候开奖？ 次数集满就开奖，每轮奖品数量丰厚',
    '如何使用奖品？可在“我的奖品”或“我的收获”点击使用',
    '失败补偿积分？开奖失败，会退还积分，大胆夺宝吧！',
  ],
}

router.get('/index', (req, res) => {
  res.render('snatch/View', renderData)
})

export default function(app) {
  app.use('/snatch', router)
  recordController(router)
  detailController(router)
}
