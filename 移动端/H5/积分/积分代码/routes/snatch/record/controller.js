import serverConfig from '../../../server.config'

const renderData = {
  ...serverConfig
}

export default function (router) {
  router.get('/record', (req, res, next) => {
    res.render('snatch/record/View', renderData)
  })
}
