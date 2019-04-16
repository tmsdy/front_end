/**
 * Created by liuzhimeng.
 * @date 2018/8/9
 * @description
 */

import serverConfig from '../../../server.config'

const renderData = {
  ...serverConfig
}

export default function (router) {
  router.get('/list', (req, res, next) => {
    res.render('auction/list/View', renderData)
  })
}
