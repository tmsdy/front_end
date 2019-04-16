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
  router.get('/edit_address', (req, res, next) => {
    res.render('orderlist/address/View', renderData)
  })
}
