/**
 * Created by liuzhimeng.
 * @date 2019-04-20
 * @description 通用工具集
 */

import {AsyncStorage} from 'react-native'
import CryptoJS from 'crypto-js'
import {DeviceModule, EventModule, QYRNBridge} from '@iqiyi/rn-base-modules'
import {isIOS, isObj, isStr} from '@iqiyi/rn-utils'
import {md5} from '../md5'
import {BLOCK_DOWNLOAD_DEVICE_MKEY, COUPON_LIST, DUIBA, GET_ENV, isDev, SINGLE_COUPON} from '../../constants/configs'
import {PGC_HOME} from '../../components/question/QuestionConst'
import {QipuDataItem} from '../../typings/apis/homePage'

/**
 * 过滤指定的道具参数
 * @param lists     道具列表
 * @param name      关键字
 * @returns {*}     返回道具map或指定关键字的value值
 */
export function formatExts(lists = [], keyName) {
  const extMap = {}
  for(const {name, value} of lists) {
    extMap[name] = value
  }
  if(keyName && extMap[keyName]) {
    return extMap[keyName]
  }
  return keyName ? '' : extMap
}

export function getSign(param, secretKey = 'NKebb0M17dC5ihNSoTlX') {
  // 对参数字典排序
  const keys = Object.keys(param)
    .sort();
  const sign = `${keys.map(k => `${k}=${param[k]}`)
    .join('|')}|${secretKey}`;
  return md5(sign);
}

export function getSignForDuiba(param) {
  const _param = {
    ...param,
    appSecret: DUIBA[GET_ENV()].appSecret,
  };
  const keys = Object.keys(_param)
    .sort();
  const sign = `${keys.map(k => `${_param[k]}`)
    .join('')}`;
  return md5(sign)
}

export function getSignForCouponList(param) {
  const keys = Object.keys(param)
    .sort();
  const sign = `${keys.map(k => `${k}=${param[k]}`)
    .join('&')}${COUPON_LIST[GET_ENV()].key}`;
  return md5(sign)
}

export function getSignForSingleCoupon(param, partner) {
  const keys = Object.keys(param)
    .sort();
  const sign = `${keys.map(k => `${k}=${param[k]}`)
    .join('&')}${SINGLE_COUPON[GET_ENV()][partner]}`;
  return md5(sign)
}

export function formatParams(data) {
  return Object.keys(data)
    .map(key => (`${key}=${encodeURIComponent(data[key])}`))
    .join('&');
}

// Unix 格式化为 yyyy-MM-dd
export function unixTimeToFormat(str) {
  if(!str) return '';

  const date = str ? new Date(str) : new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const yearStr = `${year}-`;
  const monthStr = month >= 10 ? `${month}-` : `0${month}-`;
  const dayStr = day >= 10 ? day : `0${day}`

  return yearStr + monthStr + dayStr
}

export function createUrl(url, param) {
  const p = {
    ...param,
    sign: getSign(param),
  }
  return `${url}?${formatParams(p)}`
}

export function lessText(str) {
  // 现在又说不需要截断
  let temp = str
  if(temp.length > 6) {
    temp = temp.replace(/^(.{6}).+$/g, '$1...')
  }
  return temp

}

interface IPicItem {
  photoKey: string;
  url: string;
}
interface PicMap {
  default?: string; // 默认图片
  movepic?: string;
  smallpic?: string; // 小图
  largepic?: string; // 大图
  [propName: string]: string;
}
export function filterPic(list: IPicItem[] = [], keyName = '', defaultValue?: any): string | PicMap {
  if(!list) {
    return defaultValue
  }
  const picMap: PicMap = {}
  for(const {photoKey, url} of list) {
    if(!!keyName && photoKey === keyName) {
      return url
    }
    picMap[photoKey] = url
  }

  if(keyName && picMap.default) {
    return picMap.default
  }

  return !keyName ? picMap : defaultValue
}

/**
 * 获取道具扩展信息中的图片（图片优先级由产品 @龚腾 定的）
 * @param {PicMap} picMap
 */
export function getImageByPropExts(picMap: PicMap = {}): string {
  if(!picMap) return null
  return picMap.movepic || picMap.smallpic || picMap.largepic
}

interface IExtItem {
  name: string;
  value: string;
}
interface ExtMap {
  [propName: string]: string;
}
/* eslint-disable */
export function filterExts(list: IExtItem[], keyName: string, defaultValue?: string): string;
export function filterExts(list: IExtItem[]): ExtMap;
export function filterExts(list: IExtItem[] = [], keyName?: string, defaultValue?: string): string | ExtMap {
  if(!list) {
    return defaultValue
  }
  const extMaps: ExtMap = {}
  for(const {name, value} of list) {
    if(!!keyName && name === keyName) {
      return value
    }
    extMaps[name] = value
  }
  return !keyName ? extMaps : defaultValue
}

export function creatShareUrl(url, param) {
  if(url.indexOf('?') !== -1) {
    return `${url}${formatParams(param)}`
  }
  return `${url}?${formatParams(param)}`
}

export function compare(str) {
  return (obj1, obj2) => {
    const value1 = obj1[str]
    const value2 = obj2[str]
    if(value1 < value2) {
      return 1
    } else if(value1 > value2) {
      return -1
    }
    return 0
  }
}

export function goToDianShangDetail(itemId) {
  const url = 'iqiyi://mobile/register_business/mall?pluginParams='
  const params = {
    biz_id: 1,
    biz_plugin: 'com.iqiyi.imall',
    biz_params: {
      biz_sub_id: 11, // 子业务id，各个垂线业务自己定义，详见上面2.子业务分类和参数说明。
      biz_params: 'id', // 子业务静态参数，一般不变
      biz_dynamic_params: itemId, // 运营动态投放或者基线接口动态组装，比如bookid，h5url的具体值或者参数的组合，以&链接，详见上面2.子业务分类和参数说明
      biz_extend_params: '', // 扩展参数，由各个业务线自己定义，方便以后扩展。接口或者app不做修改
      biz_statistics: 'source=9&odfrm=creditsmall', // 统计相关带入参数
    },
  }
  return url + encodeURIComponent(encodeURIComponent(JSON.stringify(params)))
}

export function saveAsyncStorage(param) {
  return AsyncStorage.multiSet(param);
}

export function getAsyncStorage(param, callback) {
  return AsyncStorage.multiGet(param, callback);
}

const PREFIX = '@QYIntegral:';

/**
 * 获取storage数据
 * @param key
 * @returns {Promise(JSON)}
 */
export async function getStorage(key: string): Promise<any> {
  try {
    const value = await AsyncStorage.getItem(`${PREFIX}${key}`);
    return JSON.parse(value) || undefined;
  } catch(e) {
    console.warn(e); // eslint-disable-line no-console
  }
  return undefined;
}

/**
 * 存储数据到storage
 * @param key
 * @param value - {JSON} 存储的数据必须保持JSON格式
 * @returns {Promise<any>}
 */
export async function setStorage(key: string, value: any): Promise<any> {
  try {
    await AsyncStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
    return value;
  } catch(e) {
    console.warn(e); // eslint-disable-line no-console
  }
  return false;
}

const ONE_DAY = 24 * 60 * 60 * 1000;
const TS = Date.now() + 28800000;

export function filterPoster(p) {
  const date = p.key_value_pair.filter(kp => kp.name === 'date')[0]
    && p.key_value_pair.filter(kp => kp.name === 'date')[0].value;
  const TS2 = Date.parse(date.split(' ')[0]);
  return (((TS - TS2) / ONE_DAY) >= 0 && ((TS - TS2) / ONE_DAY) < 7);
}

export function filterNotes(task) {
  // 签到进度展示签到规则特殊处理
  const {signRule} = task
  if(signRule) return 1
  const {exts = []} = task
  return formatExts(exts, 'notes')
}

export function filterArray(array = [], key, value) {
  let result = array.filter(kv => kv.name === key)[0]
  result = result && result[value]
  return result
}

// aes 加密
// 加密
export function getAES(data, key, iv) { // 加密
  let srcs = CryptoJS.enc.Utf8.parse(data);
  const encrypted = CryptoJS.AES.encrypt(srcs, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.ciphertext.toString();
}

// 解密
export function getDAesString(str, key, iv) { // 解密
  let encryptedHexStr = CryptoJS.enc.Hex.parse(str);
  let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  let decrypt = CryptoJS.AES.decrypt(srcs, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}

export function goToLogin() {
  const params = {
    biz_id: 103,
    biz_plugin: 'qiyibase', // 安卓必须加上 biz_plugin
    biz_params: {
      biz_sub_id: 101,
      biz_params: 'loginType=1',
    },
  }

  if(isIOS) {
    QYRNBridge.navigate(JSON.stringify(params))
  } else {
    const pluginParams = encodeURIComponent(encodeURIComponent(JSON.stringify(params)))
    const url = `iqiyi://mobile/register_business/qyclient?pluginParams=${pluginParams}`
    QYRNBridge.navigate(url)
  }
}

const CouponImageURLs = {
  qiyue: 'http://pic2.qiyipic.com/common/lego/20180702/9d8ecb9e2a5647d9a9be840fd6a684b5.png',
  movie_ticket: 'http://pic2.qiyipic.com/common/lego/20180702/8141210ed13f43b2b1934d6a6ba398b2.png',
  manhua_iqiyi: 'http://pic0.qiyipic.com/common/lego/20180702/bb08d508007e4bd0a4330fe9cf013b7c.png',
  iqiyi_mall: 'http://pic0.iqiyipic.com/common/lego/20180720/c24c13580f3544a9a6ac9f12851b80f7.png',
  chongzhi: 'http://pic0.iqiyipic.com/common/lego/20180720/1c8ed8e81ad644689222de615e680fd8.png',
  backup: 'http://pic1.iqiyipic.com/common/lego/20180720/a71dad46c5924d1080b2cce2db9b850e.png',
};

const CouponDetailURLs = {
  qiyue: 'http://pic0.qiyipic.com/common/lego/20180702/696d5cd7a8184b12a7b861b6c7f2529e.png',
  movie_ticket: 'http://pic3.qiyipic.com/common/lego/20180702/af4fb2a2c5294f54aa5258de05418aed.png',
  manhua_iqiyi: 'http://pic3.qiyipic.com/common/lego/20180702/a95f1026a5784811834119493f0ab411.png',
  iqiyi_mall: 'http://pic3.iqiyipic.com/common/lego/20180720/f85e5d3093774e819af0f376e3da6409.png',
  chongzhi: 'http://pic1.iqiyipic.com/common/lego/20180720/23510b5f931b4727aad303ba0faa7c7e.png',
  backup: 'http://pic3.iqiyipic.com/common/lego/20180720/9e3b61214c74438f9694aab8d7de3858.png',
}

// 卡券图片
export function getCouponImage(partner, type) {
  if(type === 'list') {
    return CouponImageURLs[partner] || CouponImageURLs.backup;
  }
  if(type === 'detail') {
    return CouponDetailURLs[partner] || CouponDetailURLs.backup;
  }
}

// google 和vivo渠道屏蔽下载任务
export function blockDownload(list) {
  const {mkey} = DeviceModule.get()
  if(BLOCK_DOWNLOAD_DEVICE_MKEY.indexOf(mkey) >= 0) {
    return list.filter((item) => {
      // console.log(!item.exts.filter(e => e.name === 'isdownload')[0]) // eslint-disable-line no-console
      return !!item.exts && !filterExts(item.exts, 'isdownload')
    })
  }
  return list
}

function formatTimeWithZero(time: number, split = ''): string {
  const t = time < 10 ? `0${time}` : time
  return `${t}${split}`
}

/**
 * 时间&时间戳相互转换工具
 * @param type {String} 要转换的类型 timestamp：转换成时间戳；datetime：转换成时间日期
 * @param value {String or Number} 时间日期 or 时间戳
 * @param split {String} 日期分隔符
 * @param oppositeTime {Boolean} 48小时内显示相对时间
 * @returns {*}
 */
export function transferTimeTo(type: string, value, split = '-'): number | string {
  if(type === 'timestamp') {
    return new Date(value).getTime()
  }
  if(type === 'datetime') {
    const date = new Date(value);
    const yy = date.getFullYear() + split;
    const mm = formatTimeWithZero(date.getMonth() + 1, split);
    const dd = formatTimeWithZero(date.getDate(), ' ');
    const hh = formatTimeWithZero(date.getHours(), ':');
    const mmi = formatTimeWithZero(date.getMinutes(), ':');
    const ss = formatTimeWithZero(date.getSeconds());
    return yy + mm + dd + hh + mmi + ss
  }
  return null
}

export function splitTime(datetime = '', split = '-') {
  const _dt = datetime.split(' ')
  if(_dt.length === 2) {
    const [year, month, day] = _dt[0].split(split)
    const [hour, minute, second] = _dt[1].split(':')
    const fixMonth = month.slice(0, 1) === '0' ? month.slice(1) : month
    const fixDay = day.slice(0, 1) === '0' ? day.slice(1) : day
    return [year, fixMonth, fixDay, hour, minute, second]
  }
  return []
}

/**
 * 格式化为相对时间
 * @param targetTime {number} 目标时间
 * @param split {string} 分隔符
 * @returns {string} 相对时间
 */
export function formatRelativeTime(targetTime, split = '-') {
  const nowTime = Date.now()
  const formatTime = String(transferTimeTo('datetime', targetTime, split))
  const [, , , hour, minute] = splitTime(formatTime, split)
  // 开始时间所在当天的00:00:00时间
  const dayStart = new Date(targetTime).setHours(0, 0, 0, 0)
  const oneDay = 24 * 3600 * 1000

  // 当前时间早于目标零点时间一天 或 当前时间超过目标时间
  if(nowTime < dayStart - oneDay || nowTime >= targetTime) {
    return formatTime.slice(5, -3)
  }
  // 当前时间早于目标零点时间，表示明天
  if(nowTime >= dayStart - oneDay && nowTime < dayStart) {
    return `明天 ${hour}:${minute}`
  }
  // 当前时间晚于目标零点时间，表示已经处于【今天】
  if(nowTime >= dayStart) {
    return `今天 ${hour}:${minute}`
  }
}

export function getuuid() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // eslint-disable-line
  }

  let uuid = (`${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`);
  uuid.toString().replace(/-/g, '');
  return `daoju_${uuid}`
}

// 由于ios基线自己实现的导航和生命周期管理，需要通过原生容器跳转才能触发生命周期回调  985 以上版本有效
export function iosOpenRnPage(uniqueID, param) {
  if(isIOS) {
    EventModule.emit(uniqueID, {
      action: 'navigate',
      param,
    })
  } else {
    QYRNBridge && QYRNBridge.navigate(JSON.stringify(param))
  }
}

/**
 * 格式化参数
 * 将值类型为数组的参数格式化为','连接的字符串
 * 将值类型为undefined/null/empty string的参数删除
 * @param params {object}
 * @returns {object}
 */
export const paramsSerializer = (params = {}) => {
  const o = {};
  Object.keys(params)
    .forEach((k) => {
      const v = params[k];
      if(v !== undefined && v !== null && v !== '') {
        o[k] = v
      }
    })
  return o
}

// deep clone by json
export const cloneByJSON = v => (v ? JSON.parse(JSON.stringify(v)) : null);

/**
 * 判断对象是否为空（不查询原型链上的key）
 * @param obj
 * @returns {boolean}
 */
export const isOwnEmptyObj = (obj) => {
  for(let name in obj) {
    if(obj.hasOwnProperty(name)) {
      return false
    }
  }
  return true
}

/**
 * 是否为链接
 * @param {string} str
 * @returns {boolean}
 */
export const isURL = (str: string): boolean => {
  return typeof str === 'string' ? !!str.trim().match(/^https?/) : false
}

/**
 * 是否注册制链接
 * @param {string} str
 * @returns {boolean}
 */
export const isPluginURL = (str: string): boolean => {
  return typeof str === 'string' ? !!str.trim().match(/^iqiyi:\/\/mobile?/) : false
}

/**
 * 更新数组内元素
 * @param state
 * @param index
 * @param newValues
 * @returns {array}
 */
export const updateArrayState = (arr = [], index, newValues = {}) => {
  const newArr = [...arr]
  if(index > -1 && index < newArr.length) {
    newArr[index] = {
      ...newArr[index],
      ...newValues,
    }
  }
  return newArr
}

/**
 * 筛选出任务列表有效数据
 * 有效的 exts 或者 字段信息 包含 button、icon_new、clickEvent、URL
 */
export const filterCorrectTaskList = (list) => {
  const result = list.filter(t => (t.exts || (t.button && t.icon_new && t.clickEvent && t.URL)))
  return result
}

/**
 * 根据平台判断数据是否展示，判断字段优先级顺序： platform > platforms
 * @param extMap
 */
export const showDataByPlatform = (extMap: ExtMap = {}) => {
  if(extMap.hasOwnProperty('platform')) {
    const plats = extMap.platform.split(',') || []
    return (plats.includes('3') && isIOS) || (plats.includes('4') && !isIOS)
  }

  if(extMap.hasOwnProperty('platforms')) {
    const plats = extMap.platforms
    return (/ios/ig.test(plats) && isIOS) || (/android/ig.test(plats) && !isIOS)
  }

  return true
}

/**
 *  qipu数据转换， 接入平台相关 ，数组资源位[id1,id2,id3]
 */

export const formatQipuData = (data: [], isSort = true) => {
  // 排序
  return data.map((t) => {
    // TODO id 是否需要判断与传入的一致？
    const {elements_summary: item} = t;
    return formatQipuDataElementsSummary(item, isSort)
  })
}

/**
 * qipu数据格式处理 单个资源位 id1
 * sort 排序在chrome 中有bug，return a > b (true / false ) 可能会在android导致不排序
 * sort 官方文档compareFunction 需要 返回 1(变序) / 0（不变）/ -1 （变序）
 */
export const formatQipuDataElementsSummary = (item, isSort = true): QipuDataItem[] => {
  let newItem = []

  if(item && item.length) {
    isSort && item.sort((m, n) => {
      if(m && n) {
        return m.order - n.order
      }
      return 0
    })

    for(let m of item) {
      const {
        thumbnail_url: thumbnailUrl = '',
        key_value_pair: keyValuePair,
        entity_id: entityId,
        entity_url: entityUrl = '',
        title = {},
      } = m
      const values = filterExts(keyValuePair) || {}
      const {isLogin = '', fullscreen = ''} = values

      if(showDataByPlatform(values)) {
        newItem.push({
          ...m,
          values: {
            ...values,
            clickEvent: typeof values.clickEvent === 'string' ? values.clickEvent.toLocaleLowerCase() : '',
            isLogin: parseInt(isLogin),
            fullscreen: parseInt(fullscreen),
          },
          entityId,
          entityUrl,
          properTitle: (title && title.proper_title) ? title.proper_title : '',
          imgUrl: values.defImg_webp || thumbnailUrl,
        })
      }
    }
  }

  return newItem
}

/**
 * n代表天数,加号表示未来n天的此刻时间,减号表示过去n天的此刻时间
 */
export const getRandomDate = (n) => {
  const date = new Date()
  return date.getTime() + 1000 * 60 * 60 * 24 * n
}

/**
 * 获取传入的时间戳所在日期的零点时间戳
 * @param {Number} timestamp
 * @return {String}
 */
export const getDateBeginTime = (timestamp) => {
  return new Date(timestamp).setHours(0, 0, 0, 0);
}

/**
 * 安全地获取对象的值
 * @param obj {Object} 原始对象
 * @param keyStr {String} 对象的key，以点号连接
 * @returns {*} 返回对象key的值
 * example:
 * const obj = {
 *   a: {
 *     b: {
 *       c: 1
 *     }
 *   }
 * }
 * getObjectValueSafely(obj, 'a.b.c') // 1
 * getObjectValueSafely(obj, 'c')     // null
 * getObjectValueSafely(obj, 'a.c')   // null
 * getObjectValueSafely(obj, 'e.f.c') // null
 */
export const getObjectValueSafely = (obj, keyStr, defaultValue = null) => {
  if(isObj(obj) && isStr(keyStr)) {
    let _obj = cloneByJSON(obj)
    const keys = keyStr.split('.')
    for(let k of keys) {
      if(isObj(_obj) && _obj.hasOwnProperty(k)) {
        _obj = _obj[k]
        continue
      }
      return defaultValue
    }
    return _obj
  }
  return defaultValue
}

/*
shareType:
VIDEO = 0;
WEBPAGE = 1;
TEXT = 2;
IMAGE = 3;
 GIF = 4;
MINI_APP = 5;
FILE = 6;
 */

interface ShareInfo {
  shareType?: number;
  mp_path?: string;
  mp_type?: number;
}
function formatShareInfo(options: ShareInfo = {}) {
  const shareInfo = {
    rpage: 'integral-park',
    mp_userName: 'gh_ead7a8338ee5',
    ...options
  }
  // shareType, 1. 为webpage， 2 标识txt， 5 （小程序？）
  // 兼容测试版小程序, 0 为正式， 1为开发， 2为体验
  if(isDev() && shareInfo.mp_path && shareInfo.shareType === 5) {
    shareInfo.mp_type = 1;
  }
  return shareInfo
}

export function shareSNS(options, cb = () => {}) {
  return QYRNBridge.share(formatShareInfo(options), cb);
}

/**
 * 分享到微信
 * @param options
 * @returns {*}
 */
export function shareWx(options, cb = () => {}) {
  return QYRNBridge.shareWx(formatShareInfo(options), cb)
}
// 分享到微信朋友圈
export function shareWxTimeline(options) {
  return QYRNBridge.shareWxTimeline(formatShareInfo(options))
}

// 分享到QQ
export function shareQQ(options) {
  return QYRNBridge.shareQQ(formatShareInfo(options))
}


/**
 * 一维数组 按序号 生成二维数组 [1,2,3,4] => [[1,2],[3,4]]
 * itemLength 表示每个子数组有几个
 *  */
export const getMultiDimensionArray = (list, itemLength = 2) => {
  const newLength = Math.ceil(list.length / itemLength)
  let index = 0
  const newArr = []
  for(index; index < newLength; index++) {
    const item = []
    for(let i = 0; i < itemLength; i++) {
      const data = list[index * itemLength + i]
      if(data) {
        item.push({
          realIndex: index * itemLength + i,
          data
        })
      }
    }
    newArr.push({
      id: index,
      item
    })
  }
  return newArr
}

// json参数用 & 符号链接
export function jsonToQueryString(json) {
  let strlist = []
  for(let key in json) {
    if(json.hasOwnProperty(key)) {
      strlist.push(`${key}=${json[key]}`)
    }
  }
  return strlist.join('&')
}

export function goToPGC({openWeb, uid}) {
  if(!openWeb) return false
  // 爱奇艺号
  const bizDynamicParams = {
    uid,
    target_tab: 3
  };
  const pcgurl = JSON.parse(JSON.stringify(PGC_HOME));
  pcgurl.biz_params.biz_dynamic_params = jsonToQueryString(bizDynamicParams);
  pcgurl.biz_params.biz_sub_id = '1';
  return openWeb(JSON.stringify(pcgurl));
}

interface PageProps {
  navigation: {
    dangerouslyGetParent?(): any;
  };
  routeName: string;
}
// 获取当前页面是否是第一级展示
export function isCurrentPageOnShow({navigation = {}, routeName = ''}: PageProps) {
  try {
    const {routes} = navigation.dangerouslyGetParent().state
    // 判断乐园页面是否是栈内正在显示的页面
    if(routes[routes.length - 1].routeName === routeName) {
      return true
    }
    return false
  } catch(e) {
    return true
  }
}

/**
 * 保留小数点后N位
 * @export roundFun
 * @param {*} number 数字
 * @param {*} n 位数
 * @returns number
 */
export function roundFun(number, n) {
  return Math.round(number * Math.pow(10, n)) / Math.pow(10, n)
}

interface RunEventOnce {
  finished: boolean;
}
// 执行一次事件调用，采用前端缓存，返回false表示缓存失败
export function runEventOnce(key: string): Promise<RunEventOnce> {
  return new Promise((resolve, reject) => {
    getStorage(key).then((value) => {
      if(!value) {
        setStorage(key, true).then((finished: boolean) => {
          resolve({finished})
        })
      } else {
        reject()
      }
    })
  })
}

/**
 * 格式化时间戳
 * @param time 时间戳
 * @returns {number[]} 格式化数组
 */
interface FormatCountDownTime {
  time: number;
  text: string;
}
export function formatCountDownTime(time: number): FormatCountDownTime[] {
  const day = Math.floor(time / (24 * 60 * 60 * 1000))
  const dayTime = day * 24 * 60 * 60 * 1000
  const hour = Math.floor((time - dayTime) / (60 * 60 * 1000))
  const hourTime = (day * 24 + hour) * 60 * 60 * 1000
  const minute = Math.floor((time - hourTime) / (60 * 1000))
  const minuteTime = (day * 24 * 60 + hour * 60 + minute) * 60 * 1000
  const second = Math.floor((time - minuteTime) / 1000)

  return [
    {time: day, text: formatTimeWithZero(day)},
    {time: hour, text: formatTimeWithZero(hour)},
    {time: minute, text: formatTimeWithZero(minute)},
    {time: second, text: formatTimeWithZero(second)},
  ]
}
