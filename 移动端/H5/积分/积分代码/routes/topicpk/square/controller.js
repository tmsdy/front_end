//--------------------------------
//--Created  by  liqian  --------- 
//--------------------------------
import serverConfig from '../../../server.config';
import _ from 'lodash';

const renderData = {
    ...serverConfig
}
export default function(router) {
    router.get('/square/index', (req, res, next) => {
        res.render('topicpk/square/View', renderData);
    });
}
