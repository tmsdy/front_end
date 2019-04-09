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
  router.get('/mylist', (req, res, next) => {
    res.render('auction/myList/View', renderData)
  })
}
