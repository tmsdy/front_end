//--------------------------------
//--Created  by  liqian  --------- 
//--------------------------------
import serverConfig from '../../../server.config';
import _ from 'lodash';

const renderData = {
    ...serverConfig
}
export default function(router) {
    router.get('/detail/index', (req, res, next) => {
        res.render('topicpk/detail/View', renderData);
    });
}
