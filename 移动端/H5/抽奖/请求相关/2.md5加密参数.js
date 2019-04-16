/*

1.每个请求都会对参数进行md5加密生成一个sign随参数传到后端，后端规则引擎持有秘钥，例如：sign: b161950ef95ab84fc190e9c4a4f5a7be

import { md5 } from './md5'

function createSign(params) { // 对参数字典排序
    const keys = Object.keys(params).sort();
    const sign = `${keys.map(k => `${k}=${params[k]}`).join('|')}|wVdhCZ6yGHFhvuAqYDnK`;
    return md5(sign);
}

function buildParams(params, extra=true) {
  let temp = params;
  const sign = createSign(temp)
  temp.sign = sign
  return temp
}

function getLotteryInit(params) { //用了buildParams请求的params就带上了sign签名
  return QYRequest({
    url: API_LIST.LOTTERY_INIT,
    params: buildParams(params)
  })
}

2.

*/