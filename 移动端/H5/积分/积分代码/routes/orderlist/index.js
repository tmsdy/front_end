/**
 * 兑换记录页
 * Create By liuzhimenng
 * 2018.07.05
 */

import {Router} from 'express'
import serverConfig from '../../server.config'
import helperController from "../orderlist/helper/controller"
import editAddrController from "../orderlist/address/controller"

const router = new Router()

const renderData = {
  ...serverConfig,
}

router.get('/index', (req, res, next) => {
  res.render('orderlist/View', renderData)
})

helperController(router)
editAddrController(router)

export default function (app) {
  app.use('/orderlist', router)
}
