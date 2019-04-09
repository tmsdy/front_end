import { Router } from 'express'
import serverConfig from '../../../server.config'
import Request from 'request'
const router = Router()

const renderData = {
	...serverConfig
}

export default function (app) {
	app.use('/picUrl', router)
}

router.get('/', (req, res, next) => {
    let data = {
        name:'abc',
        uid:'pp'
    }
    let targetUrl = req.query.ico;
    console.log(targetUrl);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-PINGOTHER, Content-Type');
    res.header('Access-Control-Max-Age', '86400');
    Request(targetUrl).pipe(res);

    //res.json(data);
})
