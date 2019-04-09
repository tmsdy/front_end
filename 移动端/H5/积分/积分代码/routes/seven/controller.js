//--------------------------------
//--Created  by  liqian  --------- 
//--------------------------------
import {Router} from 'express';
import serverConfig from '../../server.config';
import Request from 'request'
import _ from 'lodash';

const router = Router();

const renderData = {
    ...serverConfig
}
export default function(app) {
    app.use('/seven', router)
}
router.get('/index', (req, res, next) => {
    res.render('seven/View', renderData);
});

router.get('/pic', (req, res, next) => {
    let targetUrl = req.query.name;
    targetUrl = decodeURIComponent(targetUrl)
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-PINGOTHER, Content-Type');
    res.header('Access-Control-Max-Age', '86400');
    Request(targetUrl).pipe(res);
});
router.get('/json', (req, res, next) => {
    let targetUrl = req.query.name;
    targetUrl = decodeURIComponent(targetUrl)
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-PINGOTHER, Content-Type');
    res.header('Access-Control-Max-Age', '86400');
    Request(targetUrl).pipe(res);
});
router.get('/images/*', (req, res, next) => {
    let targetUrl = 'https://statics-web.iqiyi.com/integral_rn/assets/json/images/' + req.params[0];
    console.log('----------',targetUrl);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-PINGOTHER, Content-Type');
    res.header('Access-Control-Max-Age', '86400');
    Request(targetUrl).pipe(res);
});
