/**
 * Created by liuzhengjie.
 * @date 2017/11/23
 * @description
 */
import {getCDNPath, isIOS} from '@iqiyi/rn-utils'

// 从缓存获取当前环境
export function GET_ENV() {
  return global._ENV_CONFIG_ // test or pro
}

export function isDev() {
  return global._ENV_CONFIG_ === 'test';
}

// 接口域名
export const BASE_URL = {
  community: {
    pro: 'http://community.iqiyi.com/openApi/',
    test: 'http://community.iqiyi.com/openApi/',
  },
  vip: {
    pro: 'http://act.vip.iqiyi.com/',
    test: 'http://act.vip.iqiyi.com/',
  },
  viptask: {
    pro: 'http://tc.vip.iqiyi.com/taskCenter/task/',
    test: 'http://tc.vip.iqiyi.com/taskCenter/task/',
  },
  danmu: {
    pro: 'http://bar-i.iqiyi.com/myna-api/',
    test: 'http://bar-i.iqiyi.com/myna-api/',
  },
}

export const DUIBA = {
  pro: {
    appKey: 'Whd5g8yrvezGHf752kqjxf8spPX',
    appSecret: 'TtKv7HabFJTBPZGcxZwPVQnGWf9',
  },
  test: {
    appKey: 'A5xtEPRD5fRBGqfU8GgpDtU2VMV',
    appSecret: '2k5A68W3VGmJyfR3HPvQjTiwvKiz',
  },
}

export const COUPON_LIST = {
  pro: {
    key: 'e078948420905d1f3bc9bd5bd33f6bef',
  },
  test: {
    key: 'ee9bb442e3168ecbf1017657bafa3d02',
  },
}
// 道具后台接口参数
export const PRODUCT_LIST = {
  pro: {
    vipList: 'TI7mSLL9V8J0GAzG',
    giftList: 'GDheGyKPyUZ1QRJt',
    exchangeList: 'IlXgtU467lIZOKCu',
    daojuList: 'uTHySO675COlmuHx',
    vipOnly: 'PgJsTCizg0PwRmxI',
  },
  test: {
    vipList: '8P1rBOZn3ML1zmtl',
    giftList: 'cqbbSCkPJ5szXnvd',
    exchangeList: 'QxAmLwi2HuQCaI17',
    daojuList: 'Iva3o2QhXCqSXEbV',
    vipOnly: 'qBL00MmEyzHQeyqe',
  },
}


// 深度任务序列
export const DEEP_TASK_LIST = ['doudizhu']
// 图片 CDN 上传地址
export const CDN_URL = 'https://statics-web.iqiyi.com/integral_rn/assets/';

interface GetCDNUrl {
  (name: string): string;
}
export const getCDNUrl: GetCDNUrl = getCDNPath('IntegralRN');

export const SINGLE_COUPON = {
  pro: {
    movie_ticket: '16a0159c51ae724fac9e37d1da0c54f5',
    iqiyi_mall: '68b117f4dbf5dd35d555ae969c2299ef',
    account: 'dd8f9e4a71c1185a0bcbe5cdfb0d74d7',
    qiyue: 'a45410e6799c167cd017e1d8073a719b',
    manhua_iqiyi: 'ff1ef6bc357c692183d68fee710edf47',
    chongzhi: '9a057cd2441b2ec375020848826cce83',
  },
  test: {
    movie_ticket: 'b9c06865b4ffdfac9c12ad8463404e43',
    iqiyi_mall: '20f2b47d05945e7a043ef0b6408c28ed',
    account: '1234567890',
    qiyue: '733cfba2816bb8ed732f31652d0071b0',
    manhua_iqiyi: 'bab75a99f5509e05f5945727324201db',
    chongzhi: '178290c366f38fad6c83d4a75a3a1919',
  },
}

export const MEDAL_SHARE_URL = {
  pro: 'https://h5.m.iqiyi.com/integralh5/medalShare/index/new',
  test: 'https://h5.m.iqiyi.com/integralh5/medalShare/index/new',
}

export const ORDERLIST = {
  test: 'http://h5-test.m.iqiyi.com/integralh5/orderlist/index',
  pro: 'http://h5.m.iqiyi.com/integralh5/orderlist/index',
}
export const QiangPaiURL = {
  test: 'http://h5-test.m.iqiyi.com/integralh5/auction/index',
  pro: 'http://h5.m.iqiyi.com/integralh5/auction/index',
}
// 我的抢拍页
export const MyQiangPaiURL = {
  test: 'http://h5-test.m.iqiyi.com/integralh5/auction/mylist',
  pro: 'http://h5.m.iqiyi.com/integralh5/auction/mylist',
}
export const TOPIC_PK = { // 话题pk地址
  test: 'http://h5-test.m.iqiyi.com/integralh5/topicpk/square/index',
  pro: 'https://h5.m.iqiyi.com/integralh5/topicpk/square/index',
}
// 话题PK分享页
export const TOPIC_PK_SHARE_URL = {
  pro: 'https://h5.m.iqiyi.com/integralh5/share/topicpk',
  test: 'http://h5-test.m.iqiyi.com/integralh5/share/topicpk',
}
// 夺宝列表
export const TREASURE_URL = {
  test: 'http://h5-test.m.iqiyi.com/integralh5/snatch/index',
  pro: 'https://h5.m.iqiyi.com/integralh5/snatch/index',
}
// 夺宝我中奖的列表
export const TREASURE_MYLIST_URL = {
  test: 'http://h5-test.m.iqiyi.com/integralh5/snatch/record?tab=1',
  pro: 'https://h5.m.iqiyi.com/integralh5/snatch/record?tab=1',
}
// 夺宝详情
export const TREASURE_DETAIL_URL = {
  test: 'http://h5-test.m.iqiyi.com/integralh5/snatch/detail',
  pro: 'https://h5.m.iqiyi.com/integralh5/snatch/detail',
}

// 填写收货地址页面
export const EDIT_ADDRESS = {
  test: 'http://h5-test.m.iqiyi.com/integralh5/orderlist/edit_address',
  pro: 'https://h5.m.iqiyi.com/integralh5/orderlist/edit_address',
}
// 兑换记录帮助页
export const Helper = {
  test: 'http://h5-test.m.iqiyi.com/integralh5/orderlist/helper',
  pro: 'https://h5.m.iqiyi.com/integralh5/orderlist/helper'
}
// 兑换记录反馈页面
export const FeedBack = {
  test: 'https://h5.m.iqiyi.com/integral/feed',
  pro: 'https://h5.m.iqiyi.com/integral/feed'
}
// 问答分享url
export const QuestionShare = {
  test: 'http://h5-test.m.iqiyi.com/integralh5/headHole/index',
  pro: 'https://h5.m.iqiyi.com/integralh5/headHole/index'
}
const MANHUA = {
  biz_id: 8,
  biz_plugin: 'com.qiyi.cartoon', // 业务安卓包名， 只对安卓插件中心有效
  biz_params: {
    biz_sub_id: 1,
    biz_dynamic_params: '',
  },
}

const pluginParams = encodeURIComponent(encodeURIComponent(JSON.stringify(MANHUA)))
export const COMIC_URL = `iqiyi://mobile/register_business/comic?pluginParams=${pluginParams}`

const RATING = {
  biz_id: 100,
  biz_plugin: 'qiyibase',
  biz_params: {
    biz_sub_id: 101,
    biz_params: 'url=http%3A%2F%2Fcards.iqiyi.com%2Fviews_category%2F3.0%2Fcategory_home%3Fpage_st%3D1%26card_v%3D3.0&cid=1',
  },
}

export const RATING_URL = JSON.stringify(RATING)

const INFO = {
  biz_id: 103,
  biz_params: {
    biz_sub_id: 129, // 个人编辑资料页
    biz_params: '',
  },
}

export const INFO_URL = JSON.stringify(INFO)

const XUFEI = {
  biz_id: 101,
  biz_plugin: '',
  biz_params: {
    biz_sub_id: 7, // 自动续费管理
    biz_params: '',
  },
}

export const XUFEI_URL = JSON.stringify(XUFEI)

const VIPCLUB = {
  biz_id: 100,
  biz_plugin: '',
  biz_params: {
    biz_sub_id: 403,
    biz_params: 'http%3a%2f%2fiface2.iqiyi.com%2fviews%2f3.0%2fvip_home%26page_st%3dvip_club',
  },
}

export const VIPCLUB_URL = JSON.stringify(VIPCLUB)

const NOVEL = {
  biz_id: 12,
  biz_plugin: 'com.qiyi.lightning',
  biz_params: {
    biz_sub_id: 1,
    biz_params: 'bookId=xxx',
    biz_statistics: 'sourceType=3',
  },
}

const pluginParams2 = encodeURIComponent(encodeURIComponent(JSON.stringify(NOVEL)))
export const NOVEL_URL = `iqiyi://mobile/register_business/lightreader?pluginParams=${pluginParams2}`

const READING = {
  biz_id: 4,
  biz_plugin: 'com.qiyi.video.reader',
  biz_params: {
    biz_sub_id: 1,
    biz_params: '',
    biz_dynamic_params: 'page_id=1&sub_page_id=0',
    biz_extend_params: 'from_where=70',
  },
}

const pluginParams3 = encodeURIComponent(encodeURIComponent(JSON.stringify(READING)))
export const READING_URL = `iqiyi://mobile/register_business/reader?pluginParams=${pluginParams3}`

const MOVIE = {
  biz_id: 3,
  biz_plugin: 'org.qiyi.android.tickets',
  biz_params: {
    biz_sub_id: 1,
    biz_dynamic_params: 'subpageid=0',
  },
}

const pluginParams4 = encodeURIComponent(encodeURIComponent(JSON.stringify(MOVIE)))
export const MOVIE_URL = `iqiyi://mobile/register_business/ticket?pluginParams=${pluginParams4}`

const MALL = {
  biz_id: 1,
  biz_plugin: 'com.iqiyi.imall',
  biz_params: {
    biz_sub_id: 1,
    biz_dynamic_params: '',
  },
}

const pluginParams5 = encodeURIComponent(encodeURIComponent(JSON.stringify(MALL)))
export const MALL_URL = `iqiyi://mobile/register_business/mall?pluginParams=${pluginParams5}`

// 黄金会员开通页
const VIP_GOLD = {
  biz_id: 101,
  biz_plugin: 'qiyipay',
  biz_params: {
    biz_sub_id: isIOS ? 2 : 1,
    biz_params: isIOS ? 'vipCashierType=1' : 'packageName=com.qiyi.video&vipCashierType=vip',
  },
}

export const VIP_GOLD_URL = JSON.stringify(VIP_GOLD)

// 会员任务页面
const VIP_TASK = {
  biz_id: '100',
  biz_params: {
    biz_sub_id: '106',
    biz_params: 'jt=1&bizId=lequmembertask&componentName=RNTemplate',
    biz_dynamic_params: '',
    biz_extend_params: 'biz_extend_params=jt',
    biz_statistics: 'jt=1',
  },
}
export const VIP_TASK_URL = JSON.stringify(VIP_TASK)
// 屏蔽渠道号
export const BLOCK_DOWNLOAD_DEVICE_MKEY = ['59e36a5e70e4c4efc6fcbc4db7ea59c1', '20232202d774247f32bb7b36480500a1']

const DAN_MU = {
  biz_id: '106', // 业务id，统一定义
  biz_plugin: 'qiyidanmu', // 业务安卓包名， 只对安卓插件中心有效
  biz_params: {
    biz_sub_id: '104', // 子业务id，各个垂线业务自己定义
    biz_params: '', // 子业务静态参数，一般不变
    biz_dynamic_params: '', // 运营动态投放或者基线接口动态组装，比如bookid，h5url的具体值或者参数的组合，以&链接
    biz_extend_params: '', // 扩展参数，由各个业务线自己定义，方便以后扩展。接口或者app不做修改
    biz_statistics: '', // 统计相关带入参数
  },
}
export const DAN_MU_URL = JSON.stringify(DAN_MU)

// 奇秀  需要 biz_params：authcookie=xx
export const QIXIU = {
  biz_id: '2',
  biz_plugin: 'com.iqiyi.ishow',
  biz_params: {
    biz_sub_id: '2',
    biz_dynamic_params: 'roomId=0&anchorId=0&from=jifenrenwu',
    biz_statistics: 'block=jifenrenwu',
  },
}
// 电商
const IQIYI_MALL = {
  biz_id: '1',
  biz_plugin: 'com.iqiyi.imall',
  biz_params: {
    biz_sub_id: '1',
    biz_params: '',
    biz_dynamic_params: '',
    biz_extend_params: '',
    biz_statistics: 'odfrm=creditstask',
  },
}
export const IQIYI_MALL_URL = `iqiyi://mobile/register_business/mall?pluginParams=${encodeURIComponent(encodeURIComponent(JSON.stringify(IQIYI_MALL)))}`

// 视频推荐页
const VIDEO_RECOMMEND = {
  biz_id: '100',
  biz_plugin: 'qiyibase',
  biz_params: {
    biz_sub_id: '111',
    biz_params: '',
    biz_dynamic_params: '',
    biz_extend_params: '',
    biz_statistics: '',
  },
}
export const VIDEO_RECOMMEND_URL = `iqiyi://mobile/register_business/qyclient?pluginParams=${encodeURIComponent(encodeURIComponent(JSON.stringify(VIDEO_RECOMMEND)))}`

// 零钱plus
const LQ_PLUS = {
  biz_id: '104',
  biz_plugin: isIOS ? '' : 'qiyiwallet',
  biz_params: {
    biz_sub_id: isIOS ? '15' : '2',
    biz_params: 'v_fc=jifen_index',
    biz_dynamic_params: '',
    biz_extend_params: '',
    biz_statistics: '',
  },
}
export const LQ_PLUS_URL = JSON.stringify(LQ_PLUS)

const GAME_LIVE = {
  biz_id: 9,
  biz_plugin: 'com.qiyi.game.live.plugin',
  biz_params: {
    biz_sub_id: 1,
    biz_dynamic_params: 'type=4',
    biz_statistics: 'block=jifen-1',
  },
}
export const GAME_LIVE_URL = JSON.stringify(GAME_LIVE)

const QIXIU_LIBAO = {
  biz_id: 2,
  biz_plugin: 'com.iqiyi.ishow',
  biz_params: {
    biz_sub_id: 2,
    biz_dynamic_params: 'roomId=0&anchorId=0&showGiftPanel=999',
    biz_statistics: 'block=jifenlibao',
  },
}
export const QIXIU_LIBAO_URL = JSON.stringify(QIXIU_LIBAO)

export const IOS_GAME_CENTER = { // ios 访问游戏中心
  biz_id: '5', // 业务id，统一定义，根据http://redmine-mobile.qiyi.domain/projects/wiki_api/wiki/Biz_control#业务线字典表
  biz_params: {
    biz_sub_id: '0', // 子业务id，各个垂线业务自己定义
    biz_extend_params: '', // 扩展参数，由各个业务线自己定义，方便以后扩展。接口或者app不做修改
    biz_statistics: 'serverid1=bstask', // 统计相关带入参数
  },
}

// export const IOS_GAME_CENTER_URL = `iqiyi://mobile/register_business/game?pluginParams=${encodeURIComponent(encodeURIComponent(JSON.stringify(IOS_GAME_CENTER)))}`
export const IOS_GAME_CENTER_URL = IOS_GAME_CENTER

// ios 访问游戏中心
export const ANDROID_GAME_CENTER = (param = 'block=bstask') => {
  return (
    {
      biz_id: '5', // 业务id，统一定义，根据http://redmine-mobile.qiyi.domain/projects/wiki_api/wiki/Biz_control#业务线字典表
      biz_plugin: 'com.qiyi.gamecenter',
      biz_params: {
        biz_sub_id: '0', // 子业务id，各个垂线业务自己定义
        biz_extend_params: '', // 扩展参数，由各个业务线自己定义，方便以后扩展。接口或者app不做修改
        biz_statistics: param, // 统计相关带入参数
      },
    }
  )
}

export const ANDROID_GAME_CENTER_URL = (param) => {
  return `iqiyi://mobile/register_business/game?pluginParams=${encodeURIComponent(encodeURIComponent(JSON.stringify(ANDROID_GAME_CENTER(param))))}`
}

export const DOWNLOAD_GAMECENTER_APK = {
  biz_id: '5', // 业务id，统一定义，根据http://redmine-mobile.qiyi.domain/projects/wiki_api/wiki/Biz_control#业务线字典表
  biz_plugin: 'com.qiyi.gamecenter',
  biz_params: {
    biz_sub_id: '9', // 子业务id，各个垂线业务自己定义
    biz_extend_params: '{βqipu_idβ: β215844220β,βappDownloadUrlβ:βhttps://apkcdn.dsgame.iqiyi.com/ppsgame/upload/unite/game/20180824/7826_1534127790_ppsguanwang_1.apkβ,βmd5β:β4A0B09164131CB4470CD7446222F27C8β,βisDownloadβ:β1β}',
    // biz_extend_params: {
    //   βqipu_idβ: 'β215844220β',
    //   βappDownloadUrlβ: 'βhttps://apkcdn.dsgame.iqiyi.com/ppsgame/upload/unite/game/20180824/7826_1534127790_ppsguanwang_1.apkβ',
    //   βmd5β:'β4A0B09164131CB4470CD7446222F27C8β',
    //   βisDownloadβ: 'β1β'
    // }, //扩展参数，由各个业务线自己定义，方便以后扩展。接口或者app不做修改
    biz_statistics: 'block=bstask01', // 统计相关带入参数,
  },
}

export const DOWNLOAD_GAMECENTER_APK_URL = `iqiyi://mobile/register_business/game?pluginParams=${encodeURIComponent(encodeURIComponent(JSON.stringify(DOWNLOAD_GAMECENTER_APK)))}`

export const GONG_YI = {
  biz_id: 100,
  biz_plugin: 'qiyibase',
  biz_params: {
    biz_sub_id: 106,
    biz_params: 'bizId=benefit_plan&componentName=Charity&pageName=Home',
  },
}

export const GONG_YI_URL = JSON.stringify(GONG_YI)

// 游戏会员只有android页面
const GAME_VIP = {
  biz_id: '5',
  biz_plugin: 'com.qiyi.gamecenter',
  biz_params: {
    biz_sub_id: '23',
    biz_extend_params: '',
    biz_statistics: 'block=bsline_store',
  },
}
export const GAME_VIP_URL = JSON.stringify(GAME_VIP)

// 卡券首页
const KAQUAN = {
  biz_plugin: 'qiyiwallet',
  biz_id: 104,
  biz_params: {
    biz_sub_id: 301,
  },
}

export const KAQUAN_URL = JSON.stringify(KAQUAN)

// 爱奇艺钱包首页
export const WALLET_PARAM = {
  biz_plugin: 'qiyiwallet',
  biz_id: 104,
  biz_params: {
    biz_sub_id: 300,
    biz_params: 'v_fc=flower',
  },
}

export const WALLET_URL = JSON.stringify(WALLET_PARAM)

export const PASSPORT_SIGN = {
  secretKey: 'jsjlfaloth9$22jhfalen',
  source: 'jifen',
}

export const PHONE_SETTING = {
  biz_id: 100,
  biz_params: {
    biz_sub_id: '431',
    biz_params: '',
    biz_dynamic_params: '',
    biz_extend_params: '',
    biz_statistics: '',
  },
  biz_plugin: 'qiyibase',
}
export const PHONE_SETTING_URL = JSON.stringify(PHONE_SETTING)

// 爱奇艺推荐首页
export const IQI_HOME_URL = 'iqiyi://mobile/home'

export const LIVE_3MIN = {
  biz_id: '9',
  biz_plugin: 'com.qiyi.game.live.plugin', // 业务安卓包名， 只对安卓插件中心有效
  biz_params: {
    biz_sub_id: '3',
    biz_params: '',
    biz_dynamic_params: 'adID=23',
    biz_extend_params: '',
    biz_statistics: 'block=jifentask-1',
  },
}

export const LIVE_3MIN_URL = JSON.stringify(LIVE_3MIN)

// 网络异常注册制链接
export const NETWORK_ERROR = {
  biz_id: 100,
  biz_plugin: 'qiyibase',
  biz_params: {
    biz_sub_id: '434',
    biz_params: '',
    biz_dynamic_params: '',
    biz_extend_params: '',
    biz_statistics: '',
  }
}
// H5商品详情页链接
export const PRODUCTDETAIL = {
  test: 'http://h5-test.m.iqiyi.com/integralh5/shoppingMall/detail/index',
  pro: 'https://h5.m.iqiyi.com/integralh5/shoppingMall/detail/index'
}
