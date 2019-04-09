import _ from 'lodash';
import fetch from 'node-fetch';
import { md5 } from '../_common/md5';

//API的url路径
const api = {
  basketball: 'http://passport.qiyi.domain/apis/inner/info/batch/byIds.action'
};
//IP域名地址
const ip = {
  localhost: '',
  test: '',
  online: ''
};
//调用后端接口5、76、77

function sign(params, secretKey) {
  let sb = '';
  let sortKey = [];
  for (let key in params) {
    sortKey.push(key);
  }
  sortKey = sortKey.sort();
  for (let num = 0; num < sortKey.length; num++) {
    let val = params[sortKey[num]];
    sb += sortKey[num] + '=' + val + '|';
  }
  sb += secretKey;
  return md5(sb);
}
function addInUrl(url, data) {
  let afterUrl = url;
  afterUrl += '?';
  for (let attr in data) {
    afterUrl += attr + '=' + data[attr] + '&';
  }
  afterUrl = afterUrl.substring(0, afterUrl.length - 1);
  return afterUrl;
}

export function getNameList() {
  let nameList = {
    uid: '123',
    uname: '爱奇艺'
  };
  let url = 'http://passport.qiyi.domain/apis/inner/info/batch/byIds.action';
  let uids = '1480002673,1480002669';
  let data = {
    uids: uids,
    timestamp: Date.parse(new Date()),
    source: 'jifen'
  };
  let secretKey = 'jsjlfaloth9$22jhfalen';
  let signInfo = sign(data, secretKey);
  let addUrl = addInUrl(url, data);
  addUrl += '&sign=' + signInfo;

  return fetch(addUrl, {
    method: 'GET',
    body: {},
    headers: { 'Content-Type': 'application/json' }
  }).then(data => data.text())
  .then(body => console.log(body));
//   .then(function(res) {
//     console.log('状态值' + res.status);
//     console.log(res);
//     //res.json(data);
//     return res;
//   });
}
