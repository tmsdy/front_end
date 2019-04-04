import '../css/index.less'
import { getUserInfo,getLotteryInit, doLottery ,multiDraw,getAttender,scoreAdd,addExtFreeTimes} from "./api";
import { goToApp,getCookie,GetQueryString, isIos,getUserId,filterPic,goToLogin} from "Common/utils";
import {LabelShow} from 'Components'
import 'promise-polyfill/src/polyfill';
import 'Components/toast'

let currentItem = $('[data-node="1"]'); // 奖盘当前选中状态
// let isLogin = getCookie('P00001'); // 用户是否登录
let isLogin = true; // 用户是否登录
let PLATFORM = null; // 页面运行的平台 app  基线webview 
let BTN_READY = false; // 奖盘初始化完成方可点击抽奖按钮
let BTN_LOCK = false;  // 上次抽奖完成之后方可进行下一次抽奖
let LOTTERY_DATA = {}; // 奖盘数据数组
let NOT_WIN_LIST = []; // 未中奖列表
let FILTER_DATA = {}; // 奖品id 位key的 对象，value为奖品详细信息包含图片标题等
let promiseLock= false;
let clickLock =false;
let lotteryCode = GetQueryString('lotteryCode');
let multiOff = false; //false: 单抽 true: 连抽三次

function Pro(){
    return new Promise((resolve,reject)=> {
        iqiyi.ready(function(flag) {
            resolve(flag);
          });
    })
}

if(!localStorage.getItem('showShareTip')){
    $('.moreLotteryTip').show()
    setTimeout(function(){
        $('.moreLotteryTip').hide()
    },3000)
    localStorage.setItem('showShareTip','hide')
}

const labelShow = new LabelShow({
    container: '#marquee',
    list: [],
    period: 2,
    spacing: 0.2,
})

const baseParams = {
    debugMode:'mdb',//测试 记得去掉
    userId: getUserId(),
    userId: 1234569,
    agenttype: isIos()? 20: 21,
    agentversion:'9.3.0', 
    srcplatform: isIos()? 20: 21,
    appver: '9.3.0',
    authCookie: getCookie('P00001')||'asda111',
}
if(isLogin){
    // baseParams['userId'] = getUserId();
    // baseParams['authCookie'] = getCookie('P00001');
    getUserInfo({
        ...baseParams,
        verticalCode: 'iQIYI',
        typeCode: 'point',
        appKey: 'lottery_h5'
    }).then((res)=>{
        res[0] && $('.myIntegral').html(`我的积分：${res[0].totalScore}`)
    })
}else{
    console.log('未登录')
    $('.myIntegral').addClass('unlogin').html('登录看积分')
    $('.smalltitle').addClass('unlogin').find('.midText').html('登录享免费抽奖，快来戳我！')
    $('.myIntegral').click(function(){
        goToLogin()
    })
    $('.smalltitle').click(function(){
        goToLogin()
    })
}


const shareoOptions = {
    title: '抽奖页面',
    shareType: 1,   //（Android适用）用于标识分享的类型，默认为0
    imgUrl: '',
    link: location.href,
}
iqiyi.onShare(shareoOptions);

// addExtFreeTimes({
//    ...baseParams, 
//    lotteryCode,
//    times: 5,
//    appKey: 'lottery_h5'
// }).then(res=>{
//     console.log(res)
// })
 
const doBindThing = function(){
    if(!BTN_LOCK && BTN_READY){
        goToLottery(LOTTERY_DATA)
    }
}

const init = function () {
    initLottery();
    $('[data-node="1"]').find('.itemBox').addClass('selected');
    Pro().then(flag=>{
        flag ? PLATFORM='app' : PLATFORM = 'browser';
        if(flag){
            hideShareBtn() // 隐藏右上角分享按钮
        }
        promiseLock = true;
        if(promiseLock && clickLock){
            doBindThing();
        }
    });  
    bind();
 }
 const hideShareBtn = function(){
     const hideshare = GetQueryString('hideshare')
     if(hideshare == 1) {
        iqiyi.hideMenu({
            force: true // 是否强制隐藏(同时隐藏所有 native 设置的菜单)
          });
     }
 }
 const renderTitle = function(data){ // 渲染奖盘标题
    let $lotteryText = $('[data-name="smalltitle"] .midText')
    let free_lottery_times = data.user_free_lottery_times
    if(free_lottery_times > 0 ){ // 抽奖类型，0:免费, 1:积分消耗
        $lotteryText.html('您还有' + free_lottery_times + '次免费机会')
    }else{
        $lotteryText.html(data.price + '  积分每次')
    }
 }

 const showToast = function(data){
    $('.noticeTip').show();
    $('.noticeTip').find('.tipContent').html(data);
    setTimeout(function(){
        $('.noticeTip').hide();
        BTN_LOCK = false;
    },4000)
 }

 const renderLotteryResult = function (data){
     if(data.winReward){ //  中奖
        if(multiOff){
            // debugger
            let idList = data.rewardInfos.map((item,i)=>item.itemId)
            circle([...idList],data)
        }else{
            circle([data.rewardInfo.itemId],data)
        }
     } else { //随机转到的一个没中奖的
         let noWinItemId = 'thx'+ NOT_WIN_LIST[parseInt(Math.random()* (NOT_WIN_LIST.length-1))];
        circle([noWinItemId],data)
     }
 }
 
 const requestLottery = function(data){
    BTN_LOCK = true;
    let appInfo = {};
    if(PLATFORM == 'app'){
        iqiyi.init(function(result) {
            if (result.result == 0) {
              console.log('获取页面初始化数据失败');
            } else {
                appInfo = result.data;
            }
          });
    } else {
        appInfo['version'] = GetQueryString('agentversion')
    }
    // debugger
    if(multiOff){
        multiDraw({
            ...baseParams,
            agentversion:appInfo.version || '9.3.0',
            appver: appInfo.version || '9.3.0',
            lotteryCode: data.code,
            times: 3,
            appKey:'lottery_h5',
        }).then((res)=>{
            console.log(res)
            renderLotteryResult(res);
        },(data)=>{
            if(data.code == 'A0001'){
               showToast('积分不足，快去赚积分吧~')
            } else {
               showToast(data.message || '网络不给力哦，请再试一次~')
            }
        })
    }else{
        doLottery({
            ...baseParams,
            agentversion:appInfo.version || '9.3.0',
            appver: appInfo.version || '9.3.0',
            lotteryCode: data.code,
            appKey:'lottery_h5',
        }).then((data) => {
            console.log(data)
            data.totalScore && $('.myIntegral').html(`我的积分：${data.totalScore}`)
           renderLotteryResult(data);
        },(data)=>{
            if(data.code == 'A0001'){
               showToast('积分不足，快去赚积分吧~')
            } else {
               showToast(data.message || '网络不给力哦，请再试一次~')
            }
        })
    }
     
 }
 
 const goToLottery = function(data){
    requestLottery(LOTTERY_DATA);
 }
 
 const bind = function(){
    $('[data-btn="start"]').on('click',function(){
        console.log('start')
        if(!isLogin){
            goToLogin()
        }else{
            clickLock = true
            if(promiseLock && clickLock){
                doBindThing()
            }
        }
        
    })
    $('[data-name="close"]').on('click',function(){
        $('.modalWrapper').hide();
    })
    $('[data-name="againBtn"]').on('click',function(){
        $('.modalWrapper').hide();
        doBindThing();
    })
    $('[data-name=myrewards]').click(function(){
        console.log('myrewards')
        isLogin ? goToApp({type: 'pageName', value: 'MyGain'}) : goToLogin()
    })
    $('[data-name=share]').click(function(){
        console.log('share')
        iqiyi.share({
            ...shareoOptions,
            success: function () {
                console.log('success')
                scoreAdd({
                    ...baseParams,
                    channelCode: 'share_get',
                    verticalCode: 'iQIYI',
                    typeCode: 'point',
                    scoreType: 1,
                    getCount: 1,
                    durationType: 0
                }).then((res) => {
                    console.log(res)
                    if(res[0].code==='A0000'){
                        setTimeout(function(){ //完成任务是异步的，这边也得异步init下
                            initLottery();
                            $.fn.toast({content: '分享成功，免费抽奖+2次'})
                        },100)
                    }else{
                        $.fn.toast({content: '分享成功'})
                    }
                }, (res) => {
                    console.log('已经完成了任务')
                    $.fn.toast({content: '分享成功'})
                })  
            },
            fail: function (err) {
                console.log('分享失败')
                console.log(err)
                $.fn.toast({content: '分享失败'})
            },
            cancel: function () {
                console.log('分享取消');
            }
        })
    })
    $('.modalWrapper').click(function(e){ //蒙层点击退出弹框
        if($(e.target).data('name') === 'wrapper'){
           $('.modalWrapper').hide();
        }
    })
    
 }
 
 const initLottery = function () {
    getLotteryInit({
        ...baseParams,
        lotteryCode,
        appKey: 'lottery_h5',
        ext: GetQueryString('ext') || false
    }).then( data => {
        console.log('data:',data)
        BTN_READY = true;
        multiOff = data.user_free_lottery_times >= 3 ? true : false ;
        LOTTERY_DATA = data;
        renderLottery(data)
        renderMarquee()
        renderBottom(data)
        if(isLogin){renderTitle(data)}
    },() => {
        console.log('接口请求失败')
    })
 }

 const renderMarquee = function(){
    getAttender({
        code: lotteryCode,
        appKey: 'lottery_h5',
        agenttype: isIos()? 20: 21,
        agentversion: '9.3.0',
        srcplatform: isIos()? 20: 21,
        appver:'9.3.0'
    }).then(res=>{
        console.log(res)
        let newList = res && res.map((item,i)=>{
            let name = item.username
            if(name.length>=5){
                name = name.substr(0,3) + '**'
            }
            return {
                text: name+' 刚刚抽到了 '+item.product
            }
        })
        let refreshLength = 60 ;//如果是2min刷新一次，2s一条，refreshLength就是60
        function nextShow(){
            refreshLength -= newList.length ;
            if(refreshLength<newList.length){
                labelShow.addList(newList.slice(0,refreshLength),true,renderMarquee)
            }else{
                labelShow.addList(newList,true,nextShow)
            }
        }
        labelShow.addList(newList,true,nextShow)
    })
 }

 const renderBottom = function (data){
    $('.ruleContent').html(data.description)
 }
 const renderLottery = function (data){
    //  console.log(data)
    let loteryList = new Array(8);
    let rewards = data.rewards;
    let not_wins = data.not_wins;
    multiOff ? $('.go').html('连抽三次') : $('.go').html('立即抽奖')

    for(let i = 0 ; i< not_wins.length;i++){
        let item = not_wins[i];
        item.location -= 1 ;
        loteryList[item.location] = item;
        NOT_WIN_LIST.push(item.location);
    }
    // console.log(loteryList)
    for(let j = 0 ;j < loteryList.length; j++){
        if(loteryList[j] == null){
            loteryList[j] = rewards.shift();
        }
        let item = loteryList[j];
        let dom = $('[data-node="'+ (j+ 1)+ '"]');
        if(item){
            $(dom.find('.itemBox img')).attr('src',item.location !=null? item.image : filterPic(item.photos,'smallpic'))
            $(dom).attr('date-itemId',item.location ? 'thx' +j : item.item_id);
            item.location ? FILTER_DATA['thx' +j] = item :   FILTER_DATA[item.item_id] = item
            dom.find('.itemName').html(item.name ? item.name : item.tips);
        }
    }
    console.log('FILTER_DATA:',FILTER_DATA)
 }
 
 const showModalToast = function(idList,data){
    let $modalBox = $('.modalBox');
    let itemId = idList[0];
    // let itemData = FILTER_DATA[itemId] ;
    let html = ''
    // console.log(itemId,data)
     if(data.winReward){ // 中奖弹窗提示
        $modalBox.css("background",`url(${require('../css/img/win.png')}) top center/cover no-repeat`)
        $modalBox.find('.awardBox').show()
        $modalBox.find('.checkPrice').show()
         idList.forEach((item,i)=>{
            html += `
            <div class="awardItem">
               <img class="resultPic" data-name="successPic" src="${filterPic(FILTER_DATA[item].photos,'smallpic')}" alt="" >
               <span class="awardName">${FILTER_DATA[item].name}</span>
            </div>
            `
         })
         $modalBox.find('.awardBox').html(html)
         
     } else {
        $modalBox.css("background",`url(${require('../css/img/miss.png')}) top center/cover no-repeat`)
        $modalBox.find('.awardBox').hide()
        $modalBox.find('.checkPrice').hide()
     }
     $('.modalWrapper').show();
     BTN_LOCK = false;
     initLottery();
 }

 const  circle = function(idList,data){
    console.log(idList,data)
     let itemId = idList[0]
    let index = parseInt(currentItem.attr('data-node'));
    currentItem.find('.itemBox').removeClass('selected');
    let i = 0;
    let time = setInterval(()=>{
        i++;
        let index = parseInt(currentItem.attr('data-node'));
        currentItem.find('.itemBox').removeClass('selected');
        let targetIndex = index % 8 + 1;
        index ++ ;
        $('[data-node="'+targetIndex+'"]').find('.itemBox').addClass('selected');
        currentItem = $('[data-node="'+targetIndex+'"]');
        if(i > (multiOff?40:20) && currentItem.attr('date-itemId') == itemId){
            // debugger
            clearInterval(time);
            showModalToast(idList,data);
        }
     },(multiOff?75:150))
 }
 
 init();
