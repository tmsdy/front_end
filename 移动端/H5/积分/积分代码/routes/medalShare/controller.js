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
    app.use('/medalShare', router)
}
router.get('/index/new', (req, res, next) => {
    renderData['userName'] = req.query.userName;
    renderData['userIcon'] = req.query.userIcon;
    renderData['date'] = req.query.date;
    renderData['description'] = req.query.description;
    renderData['channelName'] = req.query.channelName;
    renderData['channelGroup'] = req.query.channelGroup;
    renderData['channelCode'] = req.query.channelCode;
    renderData['medalPic'] = req.query.medal;
    // const channelCode = req.query.channelCode;
    // let iconName = ''
    // if (renderData['channelGroup'] == 30) {
    //     iconName = `medal_${channelCode}_new`
    // } else if (renderData['channelGroup'] == 40) {
    //     iconName = `popup_metal_lv${channelCode.split('_')[2]}_unlock`
    // } else {
    //     iconName = `modal_${channelCode}`
    // }
    // renderData['medalPic'] = 'https://statics-web.iqiyi.com/integral_rn/assets/' + iconName+'@3x.png';
    
    res.render('medalShare/View', renderData);
});
router.get('/index', (req, res, next) => {
    renderData['userName'] = req.query.userName;
    renderData['userIcon'] = req.query.userIcon;
    renderData['date'] = req.query.date;
    renderData['description'] = req.query.description;
    renderData['channelName'] = req.query.channelName;
    renderData['channelGroup'] = req.query.channelGroup;
    renderData['channelCode'] = req.query.channelCode;
    const channelCode = req.query.channelCode;
    let iconName = ''
    if (renderData['channelGroup'] == 30) {
        iconName = `medal_${channelCode}_new`
    } else if (renderData['channelGroup'] == 40) {
        iconName = `popup_metal_lv${channelCode.split('_')[2]}_unlock`
    } else {
        iconName = `modal_${channelCode}`
    }
    renderData['medalPic'] = 'https://statics-web.iqiyi.com/integral_rn/assets/' + iconName+'@3x.png';
    
    res.render('medalShare/View', renderData);
});