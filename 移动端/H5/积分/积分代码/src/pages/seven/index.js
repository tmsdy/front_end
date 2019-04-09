import './index.less'
import {
  goToApp,
  isWeixin,
} from "Common/utils"
import { getCookie, getUserId, isSafari, isIos} from './utils'
import {
  DATE,
  male,
  female_local_people,
  female,
  urlPre,
  WIDTH,
  HEIGHT,
  shareImg
} from './component'
import { shareTimeline, shareAppMessage } from 'Common/wxShare/wxSDK'
import { pvPingBack, clickPingBack, showPingBack } from './pingback'
import { taskComplete, taskList } from './api'
const DOM = {
  start: $('#start'),
  music: $('#music'),
  musicBox: $('#musicBox'),
  male: $('.male'),
  sexSelect: $('.sexSelect'),
  wrap: $('.wrap'),
  askName: $('.askName')
}
var lock = false
let stop = true;
let ISAPP = true; // 是否在基线app
const rate = WIDTH / 375
const RESULT = [] // 用户选择结果  数组
let result = { color: '#7E98B0' }; // 计算后的结果
let SEX = 'male' // 默认男生
const shareOptions = {
  title: '',
  link: '',
  imgUrl: shareImg,
  desc: ''
}
var TaskInfo = {}
let USERNAME = ''
const changeNextPage = function (index) { // 切换页面
  if (index == 1) {
    showPingBack({
      block: '110000',
      rseat: 'starttest'
    })
  } else if (index == 2) {
    showPingBack({
      block: '110001',
    })
  } else if (index == 4) {
    showPingBack({
      block: '110002'
    })
  } else if (index == 6) {
    showPingBack({
      block: '110003'
    })
  }
  $("[data-page='" + parseInt(index) + "']").removeClass('rightPosition').addClass('goToLeft');
  $("[data-page='" + parseInt(index + 1) + "']").removeClass('goToLeft').addClass('rightPosition');
  $("[data-page='" + parseInt(index + 2) + "']").show()
}

const bind = function () { // 事件绑定
  if(HEIGHT > 568) {
    $('.resultPage').addClass('large')
  }
  const { start, music, musicBox, male, sexSelect, wrap } = DOM
  $('#start').on('click', () => {
    clickPingBack({
      block: '110000',
      rseat: 'starttest'
    })
    changeNextPage(2)
  })
  $('.sexSelect > div').on('click', (event) => {
    const dom = $(event.currentTarget)
    if (dom.hasClass('female')) {
      clickPingBack({
        block: '110001',
        rseat: 'girl'
      })
      SEX = 'female'
      $('.container').addClass('female')
      $('#questionMale').hide()
      $('#questionFemale').removeClass('female')
    } else {
      clickPingBack({
        block: '110001',
        rseat: 'boy'
      })
    }
    changeNextPage(3)
    setTimeout(() => {
      $('.walk').show()
    }, 200)
  })
  const winHeight = $(window).height();
  $(window).resize(function () {
    var thisHeight = $(this).height();
    if (winHeight - thisHeight > 50) {
      //当软键盘弹出，在这里面操作
      $(".pic").css("display", "none")
    } else {
      //当软键盘收起，在此处操作
      $(".pic").css("display", "block")
    }
  });
  window.addEventListener('blur',function(){
    musicBox[0].pause();
  });
  music.on('click', (event) => { // 播放音乐按钮
    if (music.hasClass('musicno')) {
      music.addClass('active').removeClass('musicno')
      musicBox[0].play()
    } else {
      music.removeClass('active').addClass('musicno')
      musicBox[0].pause()
    }
  })
  $('#commit').on('click', () => {
    if ($('#commit').hasClass('grey')) {
      return
    }
    clickPingBack({
      block: '110002',
      rseat: 'submit_qixi'
    })
    completeShare()
    USERNAME = $('input').val();
    changeNextPage(5)
    timer(6)
    compute()
    stop = false
    $('#imageEnd')[0].onload = function () {
      stop = true
    }
    stop = true
    renderResultPage()
  })
  $('input').on('input propertychange', (event) => {
    const str = $('input').val()
    if (str && str.length) {
      $('#commit').removeClass('grey')
    } else {
      $('#commit').addClass('grey')
    }
  })
  $('.getScore').on('click', () => {
    if(isWeixin() && isIos()){
      const register = {
        biz_id: 100,
        biz_plugin: 'qiyibase',
        biz_params: {
            biz_sub_id: 106,
            biz_params: 'bizId=IntegralRN&componentName=RNIntegral',
            biz_dynamic_params: "initParams={\"pageName\":\"HomePage\"}"
        }
    }
      location.href = `https://www.iqiyi.com/app/register_business/index.html?pluginParams=${encodeURIComponent(encodeURIComponent(JSON.stringify(register)))}`
    } else {
      goToApp({ type: 'pageName', value: 'HomePage' })
    }
  })

  $('[data-node]').on('click', (event) => {
    const { start, music, musicBox, male, sexSelect, wrap, askName } = DOM
    const target = $(event.currentTarget)
    const attr = target.attr('data-node');
    const index = /(\d)_([a-z])/.exec(attr)[1]
    const selectItem = /(\d)_([a-z])/.exec(attr)[2]
    RESULT.push(selectItem)
    if (SEX == 'female') {
      clickPingBack({
        block: '110001',
        rseat: selectItem.toUpperCase() + '_' + RESULT.length + 'g'
      })
    } else {
      clickPingBack({
        block: '110001',
        rseat: selectItem.toUpperCase() + '_' + RESULT.length + 'b'
      })
    }
    target.addClass('selected')
    if (index == 5) {
      $('.walk').hide()
      changeNextPage(4)
      return
    }
    $('.longBox').css({
      'transform': 'translateX(-' + WIDTH * index + 'px)',
    })
  })
  $('.rightBtn').on('click', () => { // 爱奇艺APP内的分享按钮
    clickPingBack({
      block: '110003',
      rseat: 'share_page'
    })
    ISAPP && iqiyi.share({
      title: '七夕喜提对象指南',
      desc: result.type == 'b' ? `放弃吧，宅才是${USERNAME}的人生归宿`: `${USERNAME}会在${result.time}遇到正在${result.local}${result.people}的TA`,
      imgUrl: shareImg,
      link: location.href,
      shareType: 1,
      success: function(){
      }
    });
    if(TaskInfo && !!TaskInfo.shareTask && TaskInfo.shareTask.processTotalCount==0){ // 用户没有完成任务点击生成图片之后完成对应任务
      completeSevenTest()
    } else if(TaskInfo && !!TaskInfo.shareTask){
      lock=true
    }
  })
  $('#singleShare,#save').on('click', () => { // 生成图片按钮
    clickPingBack({
      block: '110003',
      rseat: 'downpic'
    })
    if (ISAPP) {
      drawImage(callback)
    } else {
      drawImage()
    }
    if(TaskInfo && !!TaskInfo.shareTask && TaskInfo.shareTask.processTotalCount==0){ // 用户没有完成任务点击生成图片之后完成对应任务
      completeSevenTest()
    } else if(TaskInfo && !!TaskInfo.shareTask){
      lock=true
    }
  })
}
const callback = function () {
  if (ISAPP) {
    setTimeout(() => {
      iqiyi.commonInvoke(
        'JSBRIDGE_SHARE', {
          imgUrl: '',
          shareType: 3,
          isPrintScreen: 1,
          INTERCEPT_LONG_PRESSED: 1,
          isLocalImg: 1
        },
        function (data) { }
      );
    }, 500)
  }
}
const renderResultPage = function () {
  $('.resultPage').css('background-color', result.color)
  const date = Date.now()
  document.getElementById("imageEnd").src = `${urlPre}${result.pic}_.png`
  // $('#imageEnd').attr('src', `${urlPre}${result.pic}_.png`)
  if (ISAPP) {
    $('.shareBtnNotApp').show()
    $('.shareBtnApp').hide()
  } else {
    $('.shareBtnNotApp').hide()
    $('.shareBtnApp').show()
  }
  if (result.type == 'b') {
    $('.p1').html(USERNAME);
    $('.p2').html('放弃吧,')
    $('.p3').html('宅才是你的人生归宿......')
    return
  }
  $('.p1').html(USERNAME);
  $('.p2').html('会在' + `<b>${result.time}</b>遇见正在`)
  $('.p3').html(`<b>${result.local}${result.people}</b>的TA`)
}
const compute = function () { // 计算结果
  const str = RESULT.join('')
    let type = '';
    if (SEX == 'male') {
      type = /[a-z]{3}[b|c]d/.test(str) ? 'b' : 'a';
      result.type = type;
      if (type == 'a') {
        result = /[a-z]{4}b/.test(str) ? {...result,...male[0]} : {...result,...male[Math.round(Math.random() * (male.length-1))]}
        result.time = DATE[Math.round(Math.random() * 6)]
      } else {
        result.color = '#7E98B0'
        result.pic = 'seven14'
        result.local = '放弃吧，'
        result.time = '宅才是你的人生归宿...'
      }
    } else {
      type = /[a-z]{3}c[a-z]/.test(str) ? 'b' : 'a'
      result.type = type;
      result.color = '#7E98B0'
      result.pic = 'seven13'
      if (type == 'a') {
        if (/[a-z]{2}d[a-z]{2}/.test(str)) {
          // result = Object.assign({}, result, female_local_people[0])
          result = {...result,...female_local_people[0]}
        } else if (/[a-z]d[a-z]{3}/.test(str)) {
          // result = Object.assign({}, result, female_local_people[1])
          result = {...result,...female_local_people[1]}
        } else if (/[a-z]{4}b/.test(str)) {
          // result = Object.assign({}, result, female_local_people[3])
          result = {...result, ...female_local_people[3]}
        } else {
          // result = Object.assign({}, result, female[Math.round(Math.random() * (female.length-1))])
          result = {...result, ...female[Math.round(Math.random() * (female.length-1))]}
        }
        result.time = DATE[Math.round(Math.random() * 6)]
      } else {
        result.color = '#7E98B0'
        result.pic = 'seven13'
        result.local = '放弃吧，'
        result.time = '宅才是你的人生归宿...'
      }
    }
    console.log(result)

}
const timer = function (index) { // 伪加载loading
  let i = 0;
  var time = setInterval(() => {
    if (i == 100 && stop) {
      clearInterval(time)
      changeNextPage(index)
      return
    }
    if (i == 100) {
      $('.progress').html(99 + '%')
    } else {
      $('.progress').html(i + '%')
      i += 10
    }
  }, 100)

}

const drawImage = function (cb) { // 生成分享图片
  const width = WIDTH;
  const height = HEIGHT;
  const canvas = document.createElement('canvas');
  canvas.className = 'sharePage';
  document.getElementById("body").appendChild(canvas);
  const ctx = canvas.getContext("2d");
  const backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio || 1;
  // canvas的实际渲染倍率
  const ratio = (devicePixelRatio / backingStoreRatio);
  canvas.height = height * ratio;
  canvas.width = width * ratio;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  ctx.fillStyle = result.color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = 22 * ratio + "px arial bold";
  ctx.fillText(USERNAME, 25 * ratio, HEIGHT <= 568 ? 30 * ratio : 40* ratio);
  ctx.font = 16 * ratio + "px arial";
  if (result.type == 'a') {
    ctx.fillText('会在' + `${result.time}遇见正在`, 25 * ratio, HEIGHT <= 568 ? 50 * ratio: 70 * ratio);
    ctx.fillText(`${result.local}${result.people}的TA`, 25 * ratio, HEIGHT <= 568 ? 75 * ratio: 100 * ratio);
  } else {
    ctx.fillText('放弃吧，', 25 * ratio, HEIGHT <= 568 ? 50 * ratio: 70 * ratio);
    ctx.fillText('宅才是你的人生归宿...', 25 * ratio, HEIGHT <= 568 ? 75 * ratio: 100 * ratio);
  }
  const img = new Image();
  img.className = 'test'
  img.crossOrigin = "anonymous";
  const img2 = new Image();
  img2.className = 'test2'
  img2.crossOrigin = "anonymous";
  let promise1 = new Promise((resolve, reject) => {
    img.onload = function () {
      setTimeout(()=>{
        ctx.drawImage(img, canvas.width / 2 - 331 * ratio / 2, HEIGHT <= 568 ? 100 * ratio : (canvas.height - 150 * ratio + 100 * ratio)/2 - 140*ratio, 331 * ratio, 280 * ratio);
        resolve()
      },200)
    }
    // img.onerror=function(error){
    //   console.log(error)
    //   reject()
    // }
    img.src = `${urlPre}${result.pic}.png`;
  })
  let promise2 = new Promise((resolve, reject) => {
    img2.onload = function () {
      ctx.drawImage(img2, 0, canvas.height - 150 * ratio, canvas.width, 150 * ratio);
      resolve()
    }
    // img2.onerror=function(error){
    //   console.log(error)
    //   reject()
    // }
    img2.src = 'https://statics-web.iqiyi.com/integral_rn/assets/seven/sevensharebottom.png';
  })
  Promise.all([
    promise2,
    promise1
  ]).then(() => {
    let dataImage = canvas.toDataURL();
    let imgResult = new Image();
    imgResult.className = 'success'
    imgResult.onload = function () {
      $('.container').html(imgResult);
      cb && cb()
    }
    imgResult.src = dataImage;
  })
    .catch(() => {

    })
}

const shareInit = function () { // 分享初始化
  if (isWeixin()) {
    ISAPP = false
    shareOptions.title='七夕喜提对象指南'
    shareOptions.desc = !!result.local ? (result.type == 'b' ? `放弃吧，宅才是${USERNAME}的人生归宿`: `${USERNAME}会在${result.time}遇到正在${result.local}${result.people}的TA`) : '七夕不想一个人过？快来提取你的TA吧',
    shareTimeline(shareOptions)
    shareAppMessage(shareOptions)
  } else {
    iqiyi.ready(function (flag) {
      ISAPP = flag
      iqiyi.commonInvoke(
        'JSBRIDGE_LONGPRESSED_EVENT', {
          imgUrl: '',
          shareType: 3,
          isPrintScreen: 1,
          INTERCEPT_LONG_PRESSED: 1,
          isLocalImg: 1
        },
        function (data) {
          console.log('share')
        }
      );
      iqiyi.onShare({
        title: '七夕喜提对象指南',
        desc:  !!result.local ? (result.type == 'b' ? `放弃吧，宅才是${USERNAME}的人生归宿`: `${USERNAME}会在${result.time}遇到正在${result.local}${result.people}的TA`) : '七夕不想一个人过？快来提取你的TA吧',
        imgUrl: shareImg,
        link: location.href,
        shareType: 1,
        success: function () {
          console.log('==========')
        }
      },
        function (data) {
          console.log('share')
        }
      );
    });
  }
}
const completeTask = function () {
  if (!getCookie('P00001')) {
    return
  }
  const options = {
    channelCode: 'Qixi_medal',
    typeCode: 'Point_EXP',
    getCount: 1,
    durationType: 0,
    userId: getUserId(),
    authCookie: getCookie('P00001'),
    agentversion: '9.8.0',
    appver: '9.8.0',
    version: '9.8.0'
  }
  taskComplete(options).then(() => {
    console.log('complete')
  }, () => {
    console.log('已经完成了任务')
  })
  .catch((e)=>{
    console.log(e)
  })
}
const getTaskList = function () {
  const param = {
    userId: getUserId(),
    authCookie: getCookie('P00001'),
    agentversion: '9.8.0',
    appver: '9.8.0',
    typeCode: 'point,Point_EXP',
  };
  return taskList(param).then((data) => {
    const qixi = data[1].filter(fv => fv.channelCode == 'Qixi_medal')[0]
    const shareTask = data[0].filter(fv => fv.channelCode == 'Qixi_task')[0]
    return { qixi, shareTask }
  },()=>{
    console.log('接口调用失败')
  }).catch(()=>{
    console.log('接口调用失败')
  })
}
const completeShare = function () {
  if (!getCookie('P00001')) {
    return
  }
  getTaskList().then((data) => {
    TaskInfo = data;
    if (data && data.qixi && data.qixi.processTotalCount <= 0) {
      completeTask()
      if(lock && data && data.shareTask && data.shareTask.processTotalCount <= 0){
        completeSevenTest()
      }
    }
  },()=>{
    console.log('接口调用失败')
  })
  .catch((e)=>{
    console.log(e)
  })
}
const completeSevenTest = function(){ // 完成七夕测试任务
  const params = {
    channelCode: 'Qixi_task',
    typeCode: 'point',
    getCount: 1,
    durationType: 0,
    userId: getUserId(),
    authCookie: getCookie('P00001'),
    agentversion: '9.8.0',
    appver: '9.8.0',
    version: '9.8.0'
  }
  taskComplete(params).then(()=>{
    console.log('任务完成')
  },()=>{
    console.log('任务失败')
  }).catch((e)=>{
    consle.log(e)
  })
}

const init = function () {
  // if(isSafari()){
  //   goToApp({ type: 'pageName', value: 'HomePage' })
  // }
  pvPingBack();
  DOM.musicBox[0].play()
  shareInit()
  bind()
  changeNextPage()
  // drawImage()
  timer(1);
}
init()
