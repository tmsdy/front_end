//--------------------------------
//--Created  by  liqian  --------- 
//--------------------------------
import {Router} from 'express';
import serverConfig from '../../server.config';
import _ from 'lodash';

const router = Router();

const renderData = {
    ...serverConfig
}
export default function(app) {
    app.use('/welfare', router)
}
router.get('/index', (req, res, next) => {
    res.render('welfare/View', renderData);
});
