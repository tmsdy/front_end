import './index.less';

import * as SERVICE from '../service';
import * as Util from '../util';
import {goToApp} from 'Common/utils'

import {
  failDetailPingback,
  detailPingback,
  choosePingback,
  pointPingback,
  callFailPingback,
  pvPingback,
  clickPingback,
} from '../pingback'

let hasLogin = Util.getCookie('P00001') ? true : false;
let TOPIC_DETAIL = null;
let OPTION = null; // 用户选择的选项
let BTN_STATUS = null; // 按钮的状态， 1 打call  2 领取积分
let lock = true; // 打call锁，防止连续多次请求
let TOTAL_SCORE = null; // 用户总积分
let isWebview = null;
let isClickLogin = null;
let openTimer = {};
let timer = null
let countDownName = ['', '天', '小时', '分', '秒'];
let shareOptions = {
  title: '话题打call广场',
  desc: '话题打call为了谁，瓜分积分最完美',
  imgUrl: '',
  link: location.href,
  success: function () {
    console.log('分享成功')
  },
  fail: function () {
    console.log('分享失败')
  },
  cancel: function () {
    console.log('分享取消')
  }
}

let getUserInfo = function () {
  if (!hasLogin) {
    return
  }
  let userParam = {
    userId: Util.getUserId(),
    authCookie: Util.getCookie('P00001'),
  };
  SERVICE.getUserInfo(userParam).then((data) => {
    TOTAL_SCORE = data[0].totalScore;
  })
}

iqiyi.ready(function (flag) { // jssdk 初始化
  if (flag) { // 基线webview
    $('#invite').show()
    isWebview = true;
  } else { // 外部浏览器
    $('#banner').show();
    $('#goToIntegralHome').show();
    isWebview = false;
    if (isClickLogin) {
      isClickLogin = false
      let loginUrl = '//m.iqiyi.com/user.html?redirect_url=' + encodeURIComponent(location.href);
      location.href = loginUrl;
    }
  }
});

let getTopicDetail = function () {
  let param = {};
  if (hasLogin) {
    param = {
      topicCode: Util.GetQueryString('code'),
      userId: Util.getUserId(),
      authCookie: Util.getCookie('P00001'),
      typeCode: 'point'
    }
  } else {
    param = {
      topicCode: Util.GetQueryString('code'),
      typeCode: 'point'
    }
  }
  SERVICE.getTopicDetail(param).then((data) => {
    console.log('getTopicDetail', data)

    const imgUrl = data && data['options'].length
      ? data['options'][0]['picture']
      : ''
    shareOptions = {
      ...shareOptions,
      title: data.name,
      desc: data.description,
      imgUrl,
    }
    Util.registerShare(shareOptions)

    TOPIC_DETAIL = data;
    renderTopicDetail(data);
    renderDoCallBtn(data);
  }, () => {
    pvPingback({
      ...failDetailPingback,
    })
  });
}

let renderTimer = function (count, data) {
  let timeList = [0, 0, 60 * 60 * 1000, 60 * 1000, 1000];
  let culculate = Util.drawTime(data.draw_time)
  let now = new Date().getTime();
  if (count.countdown == 1) { // 倒计时天
    return
  } else { // 倒计时小时
    timer = setInterval(function () {
      now = new Date().getTime();
      culculate = Util.drawTime(data.draw_time)
      $('#doCall').html('打Call成功，还有' + culculate.time + countDownName[culculate.countdown] + '揭晓答案').addClass('grey');
      if (data.draw_time - now <= 0) {
        console.log('draw_time, nowTime', data.draw_time, new Date().getTime(), data.draw_time - now);
        clearInterval(timer);
        getTopicDetail();
      }
    }, 1000);
  }
}

let renderDoCallBtn = function (data) {
  openTimer = false;
  $('#doCall').html('').removeClass('grey');
  let status = data.status;
  if (!hasLogin) { // 用户未登录
    if (status === 0) { // 活动未开始
      $('#doCall').html('即将开始').addClass('grey');
    } else if (status === 1) {
      $('#doCall').html(data.price + '积分打Call');
    } else {
      $('#doCall').html('打Call已结束').addClass('grey');
    }
  } else {
    if (status === 0) { // 活动未开始
      $('#doCall').html('即将开始').addClass('grey');
    } else if (status === 1) { // 投票时间内
      if (data.user_option_code === null) { // 用户未参与
        BTN_STATUS = 1 // 打call
        $('#doCall').html(data.price + '积分打Call');
      } else {
        openTimer = Util.drawTime(data.draw_time);
        $('#doCall').html('打Call成功，还有' + openTimer.time + countDownName[openTimer.countdown] + '揭晓答案').addClass('grey');
        renderTimer(openTimer, data)
      }
    } else if (status === 2) {
      if (data.user_option_code === null) { // 用户未参与
        $('#doCall').html('打Call已结束').addClass('grey');
      } else {
        openTimer = Util.drawTime(data.draw_time);
        $('#doCall').html('打Call成功，还有' + openTimer.time + countDownName[openTimer.countdown] + '揭晓答案').addClass('grey');
        renderTimer(openTimer, data)
      }
    } else if (status === 3) {
      if (data.user_option_code === null) { // 用户未参与
        $('#doCall').html('打Call已结束').addClass('grey');
      } else {
        if (data.user_option_code != data.win_option_code) {
          $('#doCall').html('好遗憾，未猜中').addClass('grey');
        } else {
          if (!data.user_reward_given) {
            BTN_STATUS = 2;// 领取积分
            $('#doCall').html('领取' + data.each_reward + '积分');
          } else {
            $('#doCall').html('已领取' + data.each_reward + '积分').addClass('grey');
          }
        }

      }
    } else if (status === 4) {
      if (data.user_option_code === null) { // 用户未参与
        $('#doCall').html('打Call已结束').addClass('grey');
      } else {
        if (data.user_option_code != data.win_option_code) {
          $('#doCall').html('好遗憾，未猜中').addClass('grey');
        } else {
          if (data.user_reward_given) {
            $('#doCall').html('已领取' + data.each_reward + '积分').addClass('grey');
          } else {
            $('#doCall').html('超过领奖时间').addClass('grey');
          }
        }
      }
    }
  }
  $('#doCall').show();
}

let renderTopicDetail = function (data) {
  if (Util.GetQueryString('share') == 'iqiyi') {
    document.title = '【积分打Call】为你支持的一方打Call，胜方瓜分' + TOPIC_DETAIL.total_reward + '积分'
  }
  let status = data.status;
  if (data.name.length > 13) {
    $("[data-node='topicName']").addClass('small');
  }
  $("[data-node='topicName']").html(data.name);
  $("[data-node='totalReward']").html('胜方瓜分' + data.total_reward + '积分');
  let renderData = '';
  if (status === 0) {
    renderData = renderTopicBox(1, data);
  } else if (status === 1) {
    if (data.user_option_code === null) {
      renderData = renderTopicBox(1, data);
    } else {
      renderData = renderTopicBox(2, data);
    }
  } else if (status >= 2) {
    renderData = renderTopicBox(2, data);
  }
  $('.middleSection').html(renderData);
  $("[data-node='instruction']").html(data.description);
}
let renderTopicBox = function (flag, data) {
  let renderData = ''

  if (data.options.length < 2) {
    return renderData
  }

  if (flag === 1) {
    if (!data.options[0].picture || !data.options[1].picture) {
      renderData = `
        <div class="item" data-node='processing'>
            <div class="noPic">
                <div class="pkIcon"></div>
                <div class="leftClickBlock" data-node="nopic" optioncode=${data.options[0].option_code}>
                    <div class="content">
                        <div class="littile_box">
                            <div class="nike" data-option='1'></div>
                        </div>
                        ${data.options[0].content || ''}
                    </div>
                </div>
                <div class="rightClickBlock" data-node="nopic" optioncode=${data.options[1].option_code}>
                    <div class="content">
                        <div class="littile_box">
                            <div class="nike" data-option='2'></div>
                        </div>
                        ${data.options[1].content || ''}
                    </div>
                </div>
            </div>
        </div>`
    } else {
      renderData = `
        <div class="item" data-node='processing'>
            <div class="boxWrap">
                <div class="pic1">
                    <img class="pic left" src="${data.options[0].picture}" alt="" data-node='leftPic'>
                </div>
                <div class="pic2">
                    <img class="pic left" src="${data.options[1].picture}" alt="" data-node='rightPic'>
                </div>
                <div class="testWrap">
                    <div class="pkIcon"></div>
                    <div class="topicBtn left">
                        <div class="selectBtn">
                            <div class="selectOption" data-option='1'></div>
                        </div>
                        <span class="leftName" data-node='leftName'>${data.options[0].title}</span>
                    </div>
                    <div class="topicBtn right">
                        <div class="selectBtn">
                            <div class="selectOption" data-option='2'></div>
                        </div>
                        <span class="leftName" data-node='rightName'>${data.options[1].title}</span>
                    </div>
                    <div class="leftClickBlock" optionCode=${data.options[0].option_code}></div>
                    <div class="rightClickBlock" optionCode=${data.options[1].option_code}></div>
                </div>
            </div>
        </div>`
    }
  } else {
    let result1 = '';
    let result2 = '';
    let inProgress = ' in-progress'
    if (data.status === 4 || data.status === 3) {
      // 与用户无关逻辑
      if (data.win_option_code) {
        inProgress = ''
        if (data.win_option_code === data.options[0].option_code) {
          result1 = `<div class="crown-left"></div>`
          result2 = ''
        } else if (data.win_option_code === data.options[1].option_code) {
          result1 = ''
          result2 = `<div class="crown-right"></div>`
        }
      }
    }
    if (!data.options[0].picture || !data.options[1].picture) {
      renderData = `
        <div class="item" data-node='processing'>
            <div class="noPic">
                <div class="leftClickBlock"  data-node="nopic" optioncode=${data.options[0].option_code}>
                    <div class="content"> ${data.options[0].content || ''}</div>
                </div>
                <div class="rightClickBlock"  data-node="nopic" optioncode=${data.options[1].option_code}>
                    <div class="content"> ${data.options[1].content || ''}</div>
                </div>
                <div class="greyWrap"></div>
                <div class="item-mask">${result1}${result2}</div>
                <div class="leftNum${inProgress}${data.user_option_code == 1 && data.status < 3 ? ' yellow' : ''}">${Util.calculatePercent(data.options[0].vote_number, data.options[1].vote_number)}%</div>
                <div class="rightNum${inProgress}${data.user_option_code == 2 && data.status < 3 ? ' yellow' : ''}">${Util.calculatePercent(data.options[1].vote_number, data.options[0].vote_number)}%</div>
                <div class="pkIcon"></div>
            </div>
        </div>`
    } else {
      renderData = ` <div class="item" data-node='end'>
        <div class="boxWrap">
            <div class="pic1 ${data.user_option_code == 1 && data.status < 3 ? 'yellowWrap' : ''}">
                <img class="pic left" src="${data.options[0].picture}" alt="" data-node='leftPic'>
                <div class="endLeftFloat">
                    ${result1}
                    <div class="percentNum${inProgress}">${Util.calculatePercent(data.options[0].vote_number, data.options[1].vote_number)}%</div>
                </div>
            </div>
            <div class="pic2 ${data.user_option_code == 2 && data.status < 3 ? 'yellowWrap' : ''}">
                <img class="pic left" src="${data.options[1].picture}" alt="" data-node='rightPic'>
                <div class="endLeftFloat">
                    ${result2}
                    <div class="percentNum${inProgress} left">${Util.calculatePercent(data.options[1].vote_number, data.options[0].vote_number)}%</div>
                </div>
            </div>
            <div class="testWrap end">
                <div class="pkIcon"></div>
                <div class="topicBtn left ${data.user_option_code == 1 && data.status < 3 ? 'yellowWrap' : ''}">
                    <span class="leftName greyFont" data-node='leftName'>${data.options[0].title}</span>
                </div>
                <div class="topicBtn right ${data.user_option_code == 2 && data.status < 3 ? 'yellowWrap' : ''}">
                    <span class="leftName greyFont" data-node='rightName'>${data.options[1].title}</span>
                </div>
            </div>
        </div>
        </div>`
    }
  }
  return renderData
}

let goToShare = function () {
  let url = '';
  if (Util.GetQueryString('share') == 'iqiyi') {
    url = location.href;
  } else {
    url = location.href.indexOf('?') == -1 ? location.href + '?' + encodeURIComponent('share=iqiyi') : location.href + encodeURIComponent('&share=iqiyi');
  }
  iqiyi.share({
    title: '【积分打Call】为你支持的一方打Call，胜方瓜分' + TOPIC_DETAIL.total_reward + '积分',
    desc: TOPIC_DETAIL.name,
    shareType: 1,   //（Android适用）用于标识分享的类型，默认为0
    imgUrl: '',
    link: url,
    success: function () {
      console.log('分享成功');
    },
    fail: function () {
      console.log('分享失败');
    },
    cancel: function () {
      console.log('分享取消');
    }
  });
}

let showToast = function (text) {
  $('.toast').show();
  $('.toast p').html(text);
  setTimeout(function () {
    $('.toast').hide();
  }, 3000);
}

let doCall = function () {
  if (BTN_STATUS == 1) {
    clickPingback({
      ...detailPingback,
      rseat: 'topic_detail_call',
    })
    if (OPTION === null) { // 用户未选择
      showToast('请先选择你要打Call的一方');
      pvPingback({
        ...choosePingback,
      })
      return
    }
    if (!lock || TOTAL_SCORE === null) {
      return;
    }
    if (TOTAL_SCORE - TOPIC_DETAIL.price < 0) { // 用户积分不足
      $('.modal').show();
      pvPingback({
        ...pointPingback,
      })
      return;
    }
    let param = {
      topicCode: TOPIC_DETAIL.code || '',
      optionCode: OPTION || '',
      userId: Util.getUserId(),
      authCookie: Util.getCookie('P00001')
    }
    $('#doCall').html('打Call中...').removeClass('grey');
    SERVICE.topicVote(param).then((data) => {
      lock = false;
      BTN_STATUS = null;
      $('#doCall').html('打Call成功').addClass('grey');
      getTopicDetail()
    }, () => {
      pvPingback({
        ...callFailPingback,
      })
      showToast('打Call失败，请稍候再试')
      $('#doCall').html(TOPIC_DETAIL.price + '积分打Call').removeClass('grey');
    })
  } else if (BTN_STATUS == 2) {
    clickPingback({
      ...detailPingback,
      rseat: 'topic_detail_reward',
    })
    let param = {
      topicCode: TOPIC_DETAIL.code || '',
      userId: Util.getUserId(),
      authCookie: Util.getCookie('P00001')
    }
    $('#doCall').html('领取奖励中...').addClass('grey');
    SERVICE.getReward(param).then((data) => {
      getTopicDetail()
    }, () => {
      showToast('领取奖励失败请稍候再试')
      $('#doCall').html('领取' + TOPIC_DETAIL.each_reward + '积分').removeClass('grey');
    })
  }
}

let bind = function () {
  $('.container').on('click', '#goToIntegralHome', function () { // 跳转到积分首页
    goToApp({type: 'pageName', value: 'HomePage'})
  });
  $('.container').on('click', '#invite', function () { //
    clickPingback({
      ...detailPingback,
      rseat: 'topic_detail_invite',
    })
    goToShare();
  });
  $('.container').on('click', '#open', function () { // 跳转到积分首页
    goToApp({type: 'pageName', value: 'HomePage'})
  });
  $('.container').on('click', '#doCall', function (event) { // 打Call
    if (!hasLogin) { // 未登录用户跳转到登录页面
      if (isWebview === null) {
        isClickLogin = true;
        return
      }
      if (isWebview === true) {
        iqiyi.loadNativePage({
          page: 'login',
          returnUrl: location.href,
          param: {
            fc: '1',
            fv: '2'
          }
        });
      } else {
        let loginUrl = 'http://m.iqiyi.com/user.html?redirect_url=' + encodeURIComponent(location.href);
        location.href = loginUrl;
      }
    } else {
      if ($(event.target).hasClass('grey') || BTN_STATUS === null) {
        return
      } else if (BTN_STATUS == 1 || BTN_STATUS == 2) {
        doCall();
      }
    }
  });
  $('.container').on('click', '.leftClickBlock,.rightClickBlock', function (event) {
    let options = $('[data-option]');
    let dom = $(event.currentTarget);
    for (let i = 0; i < options.length; i++) {
      $(options[i]).hide();
    }
    OPTION = dom.attr('optioncode');
    $('[data-option=' + '"' + OPTION + '"]').show();
  })
  $('.cancle').on('click', function () {
    $('.modal').hide();
  })
  $('.confirm').on('click', function () {
    clickPingback({
      ...detailPingback,
      rseat: 'detail_getmore',
    })
    if (isWebview) {
      location.href = Util.createRNIntegral('HomePage');
    } else {
      goToApp({type: 'pageName', value: 'HomePage'})
    }
  });
}

let init = function () {
  getUserInfo();
  bind();
  getTopicDetail()
  pvPingback({
    ...detailPingback,
  })
}

init();
