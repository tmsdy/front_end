/**
 * 脑洞大赏
 */
import {Router} from 'express'
import serverConfig from '../../server.config'

const router = new Router()

const renderData = {
  ...serverConfig
}

router.get('/index', (req, res) => {
  res.render('headHole/View', renderData)
})

export default function(app) {
  app.use('/headHole', router)
}
