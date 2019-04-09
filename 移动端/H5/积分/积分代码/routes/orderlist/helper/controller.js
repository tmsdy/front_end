/**
 * Created by liuzhimeng.
 * @date 2018/8/8
 * @description
 */

import serverConfig from '../../../server.config'

const renderData = {
  ...serverConfig
}

export default function (router) {
  router.get('/helper', (req, res, next) => {
    res.render('orderlist/helper/View', renderData)
  })
}
