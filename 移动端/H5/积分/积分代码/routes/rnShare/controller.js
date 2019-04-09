//--------------------------------
//--Created  by  liukai  --------- 
// rn 通用分享页面 ----
//--------------------------------
import {Router} from 'express';
import serverConfig from '../../server.config';
import _ from 'lodash';

const router = Router();

const renderData = {
    ...serverConfig
}
export default function(app) {
    app.use('/rnshare', router)
}
router.get('/index', (req, res, next) => {
    res.render('rnShare/View', renderData);
});
