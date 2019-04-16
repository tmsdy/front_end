//--------------------------------
//--Created  by  liqian  ---------
//--------------------------------
import {
  isIos,
  getCookie,
  getUserId
} from "Common/utils"
import {GetQueryString} from './utils'

let basicParam = {//公共参数
  p1: isIos() ? '2_22_221' : '2_22_222', //'2_20_201',
  u: getCookie('QC005'),
  v: '9.8.0',
  rn: String(Math.floor(999999999 * Math.random())),
  stime: +new Date(),
  rpage: 'Qixi',
  pu: getUserId(),
  from: GetQueryString('from') || 'share'
};

export function pvPingBack(json) {
  let param = {
    t: 'rpagev',
  };
  param = $.extend({}, param, basicParam);
  for (let i in json) {
    param[i] = json[i];
  }
  sendPingback(param);
}

export function clickPingBack(json) {
  let param = {
    t: 'click',
  };
  param = $.extend({}, param, basicParam);
  for (let i in json) {
    param[i] = json[i];
  }
  sendPingback(param);
}

export function showPingBack(json) {
  let param = {
    t: 'blockv',
  };
  param = $.extend({}, param, basicParam);
  for (let i in json) {
    param[i] = json[i];
  }
  sendPingback(param);
}

export function sendPingback(json) {//发送pingback
  let param = [];
  for (let i in json) {
    param[i] = json[i];
  }
  let image = new Image();
  let _url = 'https://msg.qy.net/v5/acg/jifen_act';
  _url.indexOf('?') == -1 ? image.src = _url + '?' + jsonToQuery(param) : image.src = _url + jsonToQuery(param);
}

let jsonToQuery = function (param) {
  let temp = [];
  for (let p in param) {
    if (param[p]) {
      temp.push(p + '=' + encodeURIComponent(param[p]) || '');
    } else {
      temp.push(p + '=');
    }
  }
  return temp.join('&');
};
