import '../css/index.less'
import {getUserInfo,getLotteryInit, doLottery ,multiDraw,getAttender,scoreAdd,addExtFreeTimes} from "./api";
import {getCookie,GetQueryString, isIos,getUserId,filterPic,goToLogin,goToApp} from "Common/utils";
import {LabelShow} from 'Components'
import {pagePingback, clickPingback, LOTTERY_RPAGE} from './pingback'
import {getParam_from,Pro,getShareLink} from "./helpers";
import TWEEN from '@tweenjs/tween.js'
import 'promise-polyfill/src/polyfill';
import 'Components/toast'

let currentItem = $('[data-node="1"]'); // 奖盘当前选中状态
let isLogin = getCookie('P00001'); // 用户是否登录
// let isLogin = true;
let PLATFORM = null; // 页面运行的平台 app  基线webview 
let BTN_READY = false; // 奖盘初始化完成方可点击抽奖按钮
let BTN_LOCK = false;  // 上次抽奖完成之后方可进行下一次抽奖
let LOTTERY_DATA = {}; // 奖盘数据数组
let NOT_WIN_LIST = []; // 未中奖列表
let FILTER_DATA = {}; // 奖品id 位key的 对象，value为奖品详细信息包含图片标题等
let clickLock =false;
let lotteryCode = GetQueryString('lotteryCode');
let multiOff = false; //false: 单抽 true: 连抽三次
let winReward = false; //是否有中奖
let idList = [];
let totalScore = 0

pagePingback(LOTTERY_RPAGE,{from:getParam_from()})

if(!localStorage.getItem('showShareTip') && isLogin){
    $('.moreLotteryTip').show()
    setTimeout(function(){
        $('.moreLotteryTip').hide()
    },5000)
    localStorage.setItem('showShareTip','hide')
}

function animate(time) {
    requestAnimationFrame(animate);
    TWEEN.update(time);
}
requestAnimationFrame(animate);

const labelShow = new LabelShow({
    container: '#marquee',
    list: [],
    period: 2,
    spacing: 0.2,
})
/* 测试参数
    debugMode:'mdb',
    userId: 12345624,
*/
const baseParams = {
    // debugMode:'mdb',
    // userId: 12345681,
    userId: getUserId(),
    agenttype: isIos()? 20: 21,
    agentversion:'9.3.0', 
    srcplatform: isIos()? 20: 21,
    appver: '9.3.0',
    authCookie: getCookie('P00001'),
}

if(isLogin){
    getUserInfo({
        ...baseParams,
        verticalCode: 'iQIYI',
        typeCode: 'point',
        appKey: 'lottery_h5'
    }).then((res)=>{
        totalScore = res[0] ? res[0].totalScore : 0
        $('.myIntegral').html(`我的积分：${totalScore}`)
    })
} else {
    $('.myIntegral').addClass('unlogin').html('登录看积分')
    $('.smalltitle').addClass('unlogin').find('.midText').html('登录享免费抽奖，快来戳我！')
    $('.myIntegral').click(function(){
        goToLogin()
    })
    $('.smalltitle').click(function(){
        goToLogin()
    })
}

const shareOptions = {
    title: '积分抽大奖',
    desc:'分享就可以免费抽奖哦~',
    shareType: 1,   //（Android适用）用于标识分享的类型，默认为0
    imgUrl: '',
    link: getShareLink(),
    dialogTitle: '分享成功赚2次免费抽奖',
    success: function () {
        if(isLogin){
            scoreAdd({
                ...baseParams,
                channelCode: 'share_get',
                verticalCode: 'iQIYI',
                typeCode: 'point',
                scoreType: 1,
                getCount: 1,
                durationType: 0
            }).then((res) => {
                if(res[0].code==='A0000'){
                    setTimeout(function(){ //完成任务是异步的，这边也得异步init下
                        initLottery();
                        if(!isIos()){
                            $.fn.toast({content: '分享成功，+2次免费机会'})
                        }
                    },500)
                } else {
                    shareOptions = {...shareOptions,dialogTitle: '分享至'}
                    $.fn.toast({content: '分享成功'})
                }
            }, (res) => {
                $.fn.toast({content: '分享成功'})
            })  
        }
    },
    fail: function (err) {
        $.fn.toast({content: '分享失败'})
    },
    cancel: function () {
        // console.log('分享取消');
    }
}

iqiyi.onShare({
    ...shareOptions,
    success: function () {
        if(isLogin){
            scoreAdd({
                ...baseParams,
                channelCode: 'share_get',
                verticalCode: 'iQIYI',
                typeCode: 'point',
                scoreType: 1,
                getCount: 1,
                durationType: 0
            }).then((res) => {
                clickPingback(LOTTERY_RPAGE, '', 'jingpai_share')
                if(res[0].code==='A0000'){
                    setTimeout(function(){ //完成任务是异步的，这边也得异步init下
                        initLottery();
                        if(!isIos()){
                            $.fn.toast({content: '分享成功，+2次免费机会'})
                        }
                    },500)
                } else {
                    shareOptions = {...shareOptions,dialogTitle: '分享至'}
                    $.fn.toast({content: '分享成功'})
                }
            }, (res) => {
                $.fn.toast({content: '分享成功'})
            })  
        }
    },
});
 
const doBindThing = function(){
    if(!BTN_LOCK && BTN_READY){
        requestLottery(LOTTERY_DATA);
    }
}

const init = function () {
    initLottery();
    $('[data-node="1"]').find('.itemBox').addClass('selected');
    Pro().then(flag=>{
        flag ? PLATFORM = 'app' : PLATFORM = 'browser';
        if(flag){
            hideShareBtn() // 隐藏右上角分享按钮
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

 const showToast = function(content,callBack){
     let $noticeTip = $('.noticeTip')
     $noticeTip.show();
     $noticeTip.find('.tipContent').html(content);
    setTimeout(function(){
        $noticeTip.hide();
        BTN_LOCK = false;
        callBack && callBack()
    },4000)
 }
 
 const bind = function(){
    $('[data-btn="start"]').on('click',function(){
        if(!isLogin){
            goToLogin()
        } else {
            clickLock = true
            if(clickLock){
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
    $('[data-name=share]').click(function(){
        clickPingback(LOTTERY_RPAGE, '', 'holex_share')
        if(PLATFORM === 'browser'){
            goToApp({
                type: 'applink',
                value: 'webview',
                params: {
                    url: location.href+"&from=share"
                }
            })
        } else {
            iqiyi.share(shareOptions)
        }
        
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
        BTN_READY = true;
        multiOff = data.user_free_lottery_times >= 3 ? true : false ;
        LOTTERY_DATA = data;
        renderLottery(data)
        renderMarquee()
        renderBottom(data)
        renderMyRewards(data)
        if(isLogin){renderTitle(data)}
    },() => {
        // console.log('接口请求失败')
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
    }).then((res)=>{
        // console.log(res)
        let refreshLength = 60 ;//如果是2min刷新一次，2s一条，refreshLength就是60
        let newList = res && res.map((item,i)=>{
            let name = item.username
            if(name.length>=5){
                name = name.substr(0,3) + '**'
            }
            return {
                text: name+' 刚刚抽到了'+item.product
            }
        })
        function nextShow(){
            refreshLength -= newList.length ;
            if(refreshLength<newList.length){
                labelShow.addList(newList.slice(0,refreshLength),true,function(){ //每次刷新的时候重新初始化labelShow
                    labelShow.state.currentKey = 0
                    labelShow.options.list = []
                    labelShow.init()
                    renderMarquee()
                })
            } else {
                labelShow.addList(newList,true,nextShow)
            }
        }
        labelShow.addList(newList,true,nextShow)
    })
 }

 const renderLottery = function (data){
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
    // console.log('FILTER_DATA:',FILTER_DATA)
 }

 const renderLotteryResult = function (data){
    winReward = data.winReward
    if(winReward){ //  中奖
       if(multiOff){
           idList = data.rewardInfos.map((item,i)=>{
               if(!item||!item.itemId){
                   return 'thx'+ NOT_WIN_LIST[parseInt(Math.random()* (NOT_WIN_LIST.length-1))];
               } else {
                   return item.itemId
               }
           })
       } else {
          idList = [data.rewardInfo.itemId] 
       }
    } else { //随机转到没中奖的
       if(multiOff){
           idList = data.rewardInfos.map((item,i)=>{
               return 'thx'+ NOT_WIN_LIST[parseInt(Math.random()* (NOT_WIN_LIST.length-1))];
           })
       } else {
           let noWinItemId = 'thx'+ NOT_WIN_LIST[parseInt(Math.random()* (NOT_WIN_LIST.length-1))];
           idList = [noWinItemId]
       }
    }
}

const requestLottery = function(data){
   BTN_LOCK = true;
   let appInfo = {};
   let $lotteryText = $('[data-name="smalltitle"] .midText')
   let free_lottery_times = data.user_free_lottery_times

   if(free_lottery_times===0 && totalScore<data.price){
        showToast('积分不足，快去赚积分吧~',function(){
            goToApp({
            value: 'HomePage'
            })
        })
        return
   }
   if(PLATFORM == 'app'){
       iqiyi.init(function(result) {
           if(result.result == 0) {
            //  console.log('获取页面初始化数据失败');
           } else {
               appInfo = result.data;
           }
         });
   } else {
       appInfo['version'] = GetQueryString('agentversion')
   }
   if(multiOff){
       clickPingback(LOTTERY_RPAGE, '200100', 'doublego')
       $lotteryText.html('您还有' + (free_lottery_times-3) + '次免费机会')
       multiDraw({
           ...baseParams,
           agentversion:appInfo.version || '9.3.0',
           appver: appInfo.version || '9.3.0',
           lotteryCode: data.code,
           times: 3,
           appKey:'lottery_h5',
       }).then((data)=>{
           renderLotteryResult(data);
       },(data)=>{
           showToast(data.message || '网络不给力哦，请再试一次~')
       })
   } else {
       clickPingback(LOTTERY_RPAGE, '200200', 'go')
       if(free_lottery_times>=1){
         $lotteryText.html('您还有' + (free_lottery_times-1) + '次免费机会')
       }
       doLottery({
           ...baseParams,
           agentversion:appInfo.version || '9.3.0',
           appver: appInfo.version || '9.3.0',
           lotteryCode: data.code,
           appKey:'lottery_h5',
       }).then((data) => {
           totalScore = data.totalScore ? data.totalScore : totalScore ;
           $('.myIntegral').html(`我的积分：${totalScore}`)
           renderLotteryResult(data);
       },(data)=>{
           if(data.code == 'A0001'){
              showToast('积分不足，快去赚积分吧~',function(){
                  goToApp({
                     value: 'HomePage'
                  })
              })
           } else {
              showToast(data.message || '网络不给力哦，请再试一次~')
           }
       })
   } 
   circle()
}

 const circle = function(){ 
    $('.itemBox').removeClass('shining shining2 shining3')
    let tween = 
        new TWEEN.Tween({n:0})
            .to({n: 600}, 8000)
            .easing(TWEEN.Easing.Sinusoidal.In)
            .onUpdate(function(p){
                let itemId = idList[0] ? idList[0] : ''
                changeSelected(p.n/8)
                if(multiOff && p.n>200 && currentItem.attr('date-itemId') == itemId){
                    handleShining('shining')
                    tween.stop();
                    nextTween(p.n,idList[1],idList,false)
                }
                if(!multiOff && p.n>300 && idList.length){
                    nextTween(p.n,idList[0],idList)
                    tween.stop();
                }
                if(p.n>540 && !idList.length){
                    showToast('网络不给力哦，请再试一次~')
                    tween.stop();
                }
            })
            .start()

 }

 const changeSelected = function(n){
    let index = parseInt(currentItem.attr('data-node'));
    let targetIndex = parseInt(n%8+1);
    if(targetIndex!==index){
        currentItem.find('.itemBox').removeClass('selected');
        $('[data-node="'+targetIndex+'"]').find('.itemBox').addClass('selected');
        currentItem = $('[data-node="'+targetIndex+'"]');
    }
}

const handleShining = function(addClass,removeClass){
    let $current = currentItem.find('.itemBox')
    $current.addClass(addClass);
    if(removeClass){
        $current.removeClass(removeClass);
    }
}

const nextTween = function(start,targetId,idList,stopOff){
    // console.log(idList)
    if(multiOff){
        let new_tween = 
                new TWEEN.Tween({n: start})
                    .to({n: start+140}, 2000)
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .onUpdate(function(p){
                        changeSelected(p.n/8)
                        if(p.n>start+70 && currentItem.attr('date-itemId') == targetId){
                            handleShining('shining2','shining')
                            new_tween.stop();
                            if(!stopOff){
                                nextTween(p.n,idList[2],idList,true)
                            } else {
                                handleShining('shining3','shining2')
                                setTimeout(()=>{
                                    showModalToast(idList);
                                },1000)
                            }
                        }
                    })
                .start()
    } else {
        let i = start/8
        let time = setInterval(()=>{
            i++
            changeSelected(i)
            if( i>start/8+4 && currentItem.attr('date-itemId') == targetId){
                handleShining('shining')
                clearInterval(time);
                setTimeout(()=>{
                    showModalToast(idList);
                },1000)
            }
        },220)
    }
}

const showModalToast = function(idList){
    let $modalBox = $('.modalBox');
    let html = ''
     if(winReward){ // 中奖弹窗提示
        $modalBox.css("background",`url(${require('../css/img/win.png')}) left center/100% 100% no-repeat`)
        $modalBox.find('.closeBtn').css('background',`url(${require('../css/img/close@2x.png')}) no-repeat center/cover;`)
        $modalBox.find('.awardBox').show()
        $modalBox.find('.checkPrice').show()
         idList.forEach((item,i)=>{
            if(item.toString().match('thx')) return
            html += `
            <div class="awardItem">
               <img class="resultPic" data-name="successPic" src="${filterPic(FILTER_DATA[item].photos,'smallpic')}" alt="" >
               <span class="awardName">${FILTER_DATA[item].name}</span>
            </div>
            `
         })
         $modalBox.find('.awardBox').html(html)
         
     } else {
        $modalBox.css("background",`url(${require('../css/img/miss.png')}) left center/100% 100% no-repeat`)
        $modalBox.find('.closeBtn').css('background',`url(${require('../css/img/close_black@2x.png')}) no-repeat center/cover;`)
        $modalBox.find('.awardBox').hide()
        $modalBox.find('.checkPrice').hide()
     }
     $('.modalWrapper').show();
     BTN_LOCK = false;
     initLottery();
 }

const renderTitle = function(data){ // 渲染奖盘标题
    let $lotteryText = $('[data-name="smalltitle"] .midText')
    let free_lottery_times = data.user_free_lottery_times
    if(free_lottery_times > 0 ){ // 抽奖类型，0:免费, 1:积分消耗
        $lotteryText.html('您还有' + free_lottery_times + '次免费机会')
    } else {
        $lotteryText.html(data.price + '  积分每次')
    }
 }

 const renderMyRewards = function(data){
    $('[data-name="myrewards"]').on('click',function(){
        clickPingback(LOTTERY_RPAGE, '', 'go_transpage')
        if(PLATFORM === 'browser'){
            goToApp({
                type: 'applink',
                value: 'webview',
                params: {
                    url: location.href+"&from=share"
                },
            })
        } else {
            let _url
            if(data.exts.length){
                _url = data.exts.find((item)=>item.name==='myawards').value
            }
            isLogin ? location.href = _url : goToLogin()
        }
        
    })
}

 const renderBottom = function (data){
    $('.ruleContent').html(data.description)
 }


 init();
