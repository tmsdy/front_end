import {Router} from 'express'
import serverConfig from '../../server.config'
import awardListController from "../auction/list/controller"
import myAwardListController from "../auction/myList/controller"

const router = new Router()

const renderData = {
  ...serverConfig,
  ruleList: [
    '抢拍规则：价高者得，如果价格相同，则先出价的人获胜，抢拍失败则不扣积分。抢拍成功后请尽快激活，激活即可享受一日VIP',
    '截止时间：活动截止时间为8月31日24点，过期不候哦~',
    '激活期限：9月7日24点之后将过期，请尽快激活体验',
    '反馈途径：您可提交至我的-我的积分-兑换记录-反馈',
    '免责提示：活动最终解释权归爱奇艺所有',
  ]
}

router.get('/index', (req, res) => {
  res.render('auction/View', renderData)
})

awardListController(router)
myAwardListController(router)

export default function (app) {
  app.use('/auction', router)
}



