/**
 * Created by liuzhimeng.
 * @date 2018/9/25
 * @description RN分享页面
 */

import {Router} from 'express'
import serverConfig from '../../server.config'
import topicpkController from "../share/topicpk/controller"

const router = new Router()

const renderData = {
  ...serverConfig,
}

topicpkController(router)

export default function (app) {
  app.use('/share', router)
}
