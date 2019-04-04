import def from './def'
import Iframe from './loadIframe'
function getJson(url, cb, cb2, callbackName) {
    var param = {
        url: url,
        timeout: 5e3,
        dataType: "jsonp",
        jsonp: "callback",
        success: function (res) {
            cb(res);
        },
        error: function (e, t) {
            if (typeof cb2 == 'function') {
                cb2();
            } else {
                //$('.cover').removeClass('hide');
                // toast('网络异常，请重试');
                $('.m-popup').addClass('hide');
                tips({ title: '网络异常', info: '请再次进入当前页面或重试' })
            }
        }
    }
    if (callbackName) param.jsonpCallback = callbackName
    $.ajax(param);
}

function toast(str) {
    $('.toast-long .c-tip').text(str);
    $('.toast-long').removeClass('hide');
    setTimeout(function () {
        $('.toast-long').addClass('hide');
    }, 3000);
}

function tips(msg) {
    $('.toast-tips,.cover').removeClass('hide')
    $('.toast-tips .c-des-tit').text(msg.title)
    $('.toast-tips .c-des-info').text(msg.info)
}

function getVipMonth() {
    window.location.href = '//www.iqiyi.com/common/flow4cu_getvip.html'
}

function setOrderStatus(pseudocode, orderStatus) {
    iqiyi.ready(function (flag) {
        if (iqiyi.syncData) {
            iqiyi.syncData({
                method: "set",
                options: {
                    "switchKey": def.curSwitchKey,
                    "pseudocode_wo": pseudocode,
                    "status_wo_package": orderStatus,
                    "phone": "",
                    "cardOrPackage": 2
                },
                success: function (data) {
                    console.log('set sucess', orderStatus)
                }
            });
        }
    });
}

function showOrderStatus(status, spid) {
    var pTip, pIcon, pBtn, getVipbar;
    if (spid == '1017') {
        pTip = def.pTipFirst;
        pIcon = def.pIconFirst;
        pBtn = def.pBtnFirst;
        getVipbar = $('.ad-bar:eq(0)')
        // status = 2 //for test
    } else if (spid == '1018') {
        pTip = def.pTipSecond;
        pIcon = def.pIconSecond;
        pBtn = def.pBtnSecond;
        getVipbar = $('.ad-bar:eq(1)')
        // status = 1 //for test
    } else {
        console.warn('unknown spid is:' + spid);
    }
    pBtn.off('click');
    pBtn.attr('spid', spid)
    getVipbar.attr('spid', spid)
    switch (Number(status)) {
        case 1:
            spid == '1017' ? pBtn.attr('rseat', 'Unicom_ordered') : pBtn.attr('rseat', 'Unicom_ordered_20');
            // pTip.text('次月自动续订；退订下月生效');
            if (window.isIap && spid == '1018') pTip.text('次月自动续订；资费从手机账户扣除');
            pIcon.text('已订购').removeClass('hide');
            pBtn.text('退订').removeClass('hide').addClass('selected');
            pBtn.on('click', function () {// unsub
                var clickSpid = $(this).attr('spid');
                $('.unsubscribe-form, .cover').removeClass('hide');
                if (clickSpid == '1017') {
                    $('.unsubscribe-form .c-des-info').text('您确定要退订15元套餐？退订将在次月生效')
                    $('.unsubscribe-form .sure').attr('rseat', 'cancleOrder_comfirm')
                    $('.unsubscribe-form .quit').attr('rseat', 'quit_canleOrder')
                } else if (clickSpid == '1018') {
                    $('.unsubscribe-form .c-des-info').text('您确定要退订20元套餐？退订将在次月生效')
                    $('.unsubscribe-form .sure').attr('rseat', 'cancleOrder_comfirm_20')
                    $('.unsubscribe-form .quit').attr('rseat', 'quit_canleOrder_20')
                } else {
                    console.warn('unknown clickSpid is:' + clickSpid);
                }
                $('.unsubscribe-form .c-gray').attr('spid', spid)// for notorder
            });
            // 已订购用户，显示出领取会员入口
            getVipbar.removeClass('hide');
            getVipbar.on('click', function () {
                var clickSpid = $(this).attr('spid');
                clickSpid == '1017' ? window.location.href = 'http://live.v.wo.cn/platform/ytpxz/7daysiqyindex.html?cid=aiqy_ap' : getVipMonth('1018'); //todo：领30天会员
            })
            spid == '1017' ? H5.sendPingback_block('vip_get_15') : H5.sendPingback_block('vip_get_20')
            spid == '1017' ? $('.activate-bar:eq(0)').addClass('hide') : $('.activate-bar:eq(1)').addClass('hide')
            break;
        case 2:
            spid == '1017' ? pBtn.attr('rseat', 'Unicom_order') : pBtn.attr('rseat', 'Unicom_order_20');
            if(window.isIap && spid == '1018') pTip.text('下月开始正常收取流量费用');
            pIcon.text('本月有效').removeClass('hide');
            pBtn.text('再次订购').removeClass('hide').removeClass('selected');
            pBtn.on('click', function () {  // resub
                var clickSpid = $(this).attr('spid');
                Iframe.loadIframe(clickSpid)
                // $('.re-subscribe-form, .cover').removeClass('hide');
                // if (clickSpid == '1017') {
                //     $('.re-subscribe-form .c-des-info').text('确定再次订购联通15元定向流量包月？')
                //     $('.re-subscribe-form .sure').attr('spid', clickSpid)
                // } else if (clickSpid == '1018') {
                //     $('.re-subscribe-form .c-des-info').text('确定再次订购联通20元定向流量包月？')
                //     $('.re-subscribe-form .sure').attr('spid', clickSpid)
                // } else {
                //     console.warn('unknown clickSpid is:' + clickSpid);
                // }
            });
            getVipbar.removeClass('hide');
            getVipbar.on('click', function () {
                var clickSpid = $(this).attr('spid');
                clickSpid == '1017' ? window.location.href = 'http://live.v.wo.cn/platform/ytpxz/7daysiqyindex.html?cid=aiqy_ap' : getVipMonth('1018'); //todo：领30天会员
            })
            spid == '1017' ? H5.sendPingback_block('vip_get_15') : H5.sendPingback_block('vip_get_20')
            spid == '1017' ? $('.activate-bar:eq(0)').addClass('hide') : $('.activate-bar:eq(1)').addClass('hide')
            break;
        default:// include case 0
            console.log('init order status:' + status);
            spid == '1017' ? pBtn.attr('rseat', 'Unicom_order') : pBtn.attr('rseat', 'Unicom_order_20');
            spid == '1017' ? pTip.text('免流量+7天会员') : pTip.text('免流量+月会员')
            pIcon.text('').addClass('hide');
            pBtn.text('立即订购').removeClass('hide');
            if (window.isIap) $('.product-tip:eq(1)').text('订购成功立即生效，次月自动续订')  // for ios 20
            if(window.isApp) {
                if (spid == '1017') {
                    $('.activate-bar:eq(0)').removeClass('hide')
                    $('.activate-btn:eq(0)').attr('spid', spid)
                } else if (spid == '1018') {
                    $('.activate-bar:eq(1)').removeClass('hide')
                    $('.activate-btn:eq(1)').attr('spid', spid)
                } else {
                    console.warn('unknown clickSpid is:' + clickSpid);
                }
                H5.sendPingback_block('active_entry')
            }
            pBtn.on('click', function () {// go order iframe
                var clickSpid = $(this).attr('spid');
                Iframe.loadIframe(clickSpid)
                // $('.phone-popup-title').text('订购联通流量包月');
                // $('.sure-buy').text('确认订购').attr('data-type', 'order');
                // $('#phone').val('');
                // $('#vcode').val('');
                // $('.phone-tip').text('');
                // $('.vcode-tip').text('');
                // $('.phone-eliminate').addClass('hide');
                // $('.phone-popup, .cover').removeClass('hide');
                // if (clickSpid == '1017') {
                //     $('.sure-buy').attr('clickSpid', clickSpid).attr('rseat', 'Order_comfirm')
                // } else if (clickSpid == '1018') {
                //     $('.sure-buy').attr('clickSpid', clickSpid).attr('rseat', 'Order_comfirm_20')
                // } else {
                //     console.warn('unknown clickSpid is:' + clickSpid);
                // }
            });
    }
}

function loadCss(){ // remove,Influence loading
    var path = def.curPackageType == 'wo+15' ? '//static.iqiyi.com/css/2018112216/h5-directional-flow.css' : '//static.iqiyi.com/css/2018120414/h5-directional-flow.css'
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.href = path;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    head.appendChild(link);
}


export { getJson, toast, tips, getVipMonth, setOrderStatus, showOrderStatus,loadCss }