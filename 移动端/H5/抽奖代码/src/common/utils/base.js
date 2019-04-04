/**
 * helper functions
 */
import { md5 } from './md5'
var ua = navigator.userAgent;
let userId;
let userHasChanged = false;
const _ua = navigator.userAgent.toLowerCase();

export function createSign(params) {
    // 对参数字典排序
    const keys = Object.keys(params).sort();
    const sign = `${keys.map(k => `${k}=${params[k]}`).join('|')}|wVdhCZ6yGHFhvuAqYDnK`;
    return md5(sign);
}

export function formatParams(data) {
  return Object.keys(data).map(key => (`${key}=${encodeURIComponent(data[key])}`)).join('&');
}

export function getUserId() {
    let json = getCookie('P00002');
    if(json == '') {
        return ''
    }
    let _userId = JSON.parse(json).uid;
    if(userId != '' && userId != _userId) {
        userHasChanged = true;
    }
    userId = _userId;
    return _userId;
}

export function getCookie (objname) {
    let arrstr = document.cookie.split("; ");
    for(let i = 0; i < arrstr.length; i++) {
        let temp = arrstr[i].split("=");
        if(temp[0] == objname)
            return unescape(temp[1]);
    }
    return '';
};

export function setCookie(opts) {
    let Days = 2;
    let exp = new Date();
    exp.setTime(exp.getTime() + 24 * 60 * 60 * 1000);
    document.cookie = opts.name + "=" + escape(opts.value) + ";expires=" + opts.expires + ";domain=" + opts.domain + opts.path;
}

export function GetQueryString(name){
    function getAllParams() {
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=decodeURIComponent(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }
    return getAllParams()[name] || null;
};

export function isNewUser(){
    let isNew = '0';
    if(!getCookie('QC006')){
        isNew = '1';
    } 
    return isNew;

}

export function filterPic(param = [], picType) {
    const picList = {};
      for (let i = 0; i < param.length; i++) {
        picList[param[i].key] = param[i];
      }
      return picList[picType] ?picList[picType].url : '';
}
