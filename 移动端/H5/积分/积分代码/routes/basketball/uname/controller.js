import { Router, api } from 'express';
import serverConfig from '../../../server.config';
import * as basketballApi from '../model';
import fetch from 'node-fetch';
import { md5 } from '../../_common/md5';

const router = Router();

const renderData = {
  ...serverConfig
};
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
export default function(app) {
  app.use('/basketball', router);
}
router.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  console.log(req.method);
  if (req.method == 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});
router.get('/', (req, res, next) => {
  const uidAdd = req.query.uidAdd;
  console.log('id列表'+uidAdd);
  let url = 'http://passport.qiyi.domain/apis/inner/info/batch/byIds.action';
  let data = {
    uids: uidAdd,
    timestamp: Date.parse(new Date()),
    source: 'jifen'
  };
  let secretKey = 'jsjlfaloth9$22jhfalen';
  let signInfo = sign(data, secretKey);
  let addUrl = addInUrl(url, data);
  addUrl += '&sign=' + signInfo;

  fetch(addUrl, {
    method: 'GET',
    body: {},
    headers: { 'Content-Type': 'application/json' }
  }).then(data => data.json())
  .then(body => {
    res.json(body);
  }
  );
});
