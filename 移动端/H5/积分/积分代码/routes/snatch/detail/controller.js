import serverConfig from '../../../server.config'

const renderData = {
  ...serverConfig
}
export default function (router) {
  router.get('/detail', (req, res, next) => {
    res.render('snatch/detail/View', renderData)
  })
}
