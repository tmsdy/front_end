/**
 *
 * @ref
 * @origin task_center_list
 * Created by liuzhimeng on 2019/04/02.
 */
module.exports = {
  delay: 0, // 延迟(ms)
  pipe: (params, response) => { // 响应返回前的处理管道
    return response;
  },
  response: {
    "code": "A00000",
    "message": "成功执行.",
    "validateResult": true,
    "data": {
      "hasDoubleCard": 0,
      "expireTime": -1556437470679,
      "taskList": {
        "lastScore": 474,
        "signScore": 7,
        "signDay": 1,
        "taskList": [{
          "icon": "http://pic2.iqiyipic.com/common/lego/20180723/20cc3e58039d46d08f799acd29c26cea.png",
          "verticalCode": "iQIYI",
          "durationType": 1,
          "matchTagCount": 0,
          "continuousScore": 0,
          "button": "去分享",
          "score": 10,
          "continuousValue": 0,
          "ruleType": 0,
          "processTotalCount": 0,
          "processWeekCount": 0,
          "startTime": 0,
          "sortNum": 800,
          "id": 181,
          "exts": [{
            "name": "_URL",
            "value": ""
          }, {
            "name": "icon_new",
            "label": "",
            "value": "http://pic2.iqiyipic.com/common/lego/20180723/20cc3e58039d46d08f799acd29c26cea.png"
          }, {
            "name": "URL",
            "label": "",
            "value": "http://www.iqiyi.com/kszt_phone/task.html"
          }, {
            "name": "clickEvent",
            "label": "",
            "value": "native"
          }, {
            "name": "button",
            "label": "",
            "value": "去分享"
          }, {
            "name": "tasklistType",
            "label": "",
            "value": "default"
          }, {
            "name": "icon",
            "label": "",
            "value": "http://m.qiyipic.com/common/lego/20170821/16baee8856844ae88b1aaf5d4487a7e4.png"
          }],
          "channelCode": "Share",
          "processMonthCount": 0,
          "processCount": 0,
          "limitTotal": 0,
          "multiple": 1,
          "getRewardWeekCount": 0,
          "channelGroup": 20,
          "limitPerMonth": 0,
          "userId": 1480396200,
          "limitPerDay": 1,
          "url": "",
          "typeCode": "point",
          "limitPerWeek": 0,
          "groupName": "每日任务",
          "getRewardMonthCount": 0,
          "getRewardTotalCount": 0,
          "channelName": "分享视频",
          "getRewardDayCount": 0,
          "endTime": 0,
          "processScore": 0
        }, {
          "trdetailList": [{
            "itemId": 2986,
            "itemName": "任务翻倍卡",
            "itemCount": 1
          }],
          "icon": "",
          "description": "",
          "verticalCode": "iQIYI",
          "durationType": 1,
          "matchTagCount": 0,
          "continuousScore": 0,
          "button": "去领取",
          "score": 88,
          "continuousValue": 0,
          "ruleType": 0,
          "processTotalCount": 0,
          "processWeekCount": 0,
          "startTime": 0,
          "sortNum": 109,
          "id": 978,
          "exts": [{
            "name": "_URL",
            "value": "{\"biz_params\":{\"biz_params\":\"bizId=IntegralRN&componentName=RNIntegral\",\"biz_statistics\":\"\",\"biz_extend_params\":\"\",\"biz_sub_id\":\"106\",\"biz_dynamic_params\":\"initParams=%7B%22pageName%22%3A%22Welfare%22%7D\"},\"biz_plugin\":\"qiyibase\",\"biz_id\":\"100\"}"
          }, {
            "name": "button",
            "value": "去领取"
          }],
          "channelCode": "gift",
          "processMonthCount": 0,
          "processCount": 0,
          "limitTotal": 1,
          "multiple": 0,
          "getRewardWeekCount": 0,
          "channelGroup": 21,
          "limitPerMonth": -1,
          "userId": 1480396200,
          "limitPerDay": 0,
          "url": "{\"biz_params\":{\"biz_params\":\"bizId=IntegralRN&componentName=RNIntegral\",\"biz_statistics\":\"\",\"biz_extend_params\":\"\",\"biz_sub_id\":\"106\",\"biz_dynamic_params\":\"initParams=%7B%22pageName%22%3A%22Welfare%22%7D\"},\"biz_plugin\":\"qiyibase\",\"biz_id\":\"100\"}",
          "typeCode": "point",
          "limitPerWeek": -1,
          "groupName": "挑战任务",
          "getRewardMonthCount": 0,
          "getRewardTotalCount": 0,
          "channelName": "领取回血包",
          "getRewardDayCount": 0,
          "endTime": 0,
          "processScore": 0
        }, {
          "icon": "",
          "nextTRLotDetail": {
            "lotCode": "test_wzp_5",
            "lotCount": 1,
            "signDay": 1,
            "lotName": "测试"
          },
          "verticalCode": "iQIYI",
          "durationType": 0,
          "matchTagCount": 0,
          "continuousScore": 0,
          "button": "",
          "score": 0,
          "continuousValue": 0,
          "ruleType": 1,
          "processTotalCount": 0,
          "processWeekCount": 0,
          "startTime": 0,
          "sortNum": 100,
          "id": 876,
          "exts": [{
            "name": "taskSlogan2",
            "label": "",
            "value": "做任务领VIP"
          }, {
            "name": "taskSlogan1",
            "label": "",
            "value": "签到领VIP"
          }, {
            "name": "tasklistType",
            "label": "",
            "value": "sign"
          }, {
            "name": "notes",
            "label": "",
            "value": "1"
          }, {
            "name": "icon",
            "label": "",
            "value": "http://m.qiyipic.com/common/lego/20170821/3ed3d32d7a494ecdac1c47bc0ac3b055.png"
          }],
          "channelCode": "Sign_test",
          "processMonthCount": 0,
          "processCount": 0,
          "trlotDetailList": [{
            "lotCode": "test_wzp_5",
            "lotCount": 1,
            "signDay": 1,
            "lotName": "测试"
          }, {
            "lotCode": "test_wzp_5",
            "lotCount": 3,
            "signDay": 3,
            "lotName": "测试"
          }],
          "limitTotal": 0,
          "multiple": 0,
          "getRewardWeekCount": 0,
          "channelGroup": 20,
          "limitPerMonth": 0,
          "userId": 1480396200,
          "limitPerDay": 1,
          "url": "",
          "typeCode": "point",
          "limitPerWeek": 0,
          "groupName": "每日任务",
          "getRewardMonthCount": 0,
          "getRewardTotalCount": 0,
          "channelName": "每日签到test",
          "getRewardDayCount": 0,
          "endTime": 0,
          "processScore": 0
        }, {
          "icon": "",
          "verticalCode": "iQIYI",
          "durationType": 1,
          "matchTagCount": 0,
          "continuousScore": 0,
          "button": "去完成",
          "score": 20,
          "continuousValue": 0,
          "ruleType": 0,
          "processTotalCount": 0,
          "processWeekCount": 0,
          "startTime": 0,
          "sortNum": 100,
          "id": 384,
          "exts": [{
            "name": "_URL",
            "value": "platform"
          }, {
            "name": "reward",
            "label": "",
            "value": "vip+7"
          }, {
            "name": "button",
            "label": "",
            "value": "去完成"
          }, {
            "name": "icon",
            "label": "",
            "value": "http://m.qiyipic.com/common/lego/20180110/abddd11906a848b79d9ce7eecd94d81a.png"
          }, {
            "name": "subhead",
            "label": "",
            "value": "超低价享VIP权益"
          }, {
            "name": "url_ios",
            "label": "",
            "value": "https://vip.iqiyi.com/firstsix-new-h5.html?fc=a6fdbf8d2205aebe"
          }, {
            "name": "url_android",
            "label": "",
            "value": "https://vip.iqiyi.com/firstsix-new-h52.html?fv=zhf2ed4a82c707c2347045692aa877f8"
          }, {
            "name": "clickEvent",
            "label": "",
            "value": "native"
          }, {
            "name": "isvip",
            "label": "",
            "value": "0"
          }],
          "channelCode": "vip_sixcharge",
          "processMonthCount": 0,
          "processCount": 0,
          "limitTotal": 1,
          "multiple": 0,
          "getRewardWeekCount": 0,
          "channelGroup": 21,
          "limitPerMonth": 0,
          "userId": 1480396200,
          "limitPerDay": 0,
          "url": "platform",
          "typeCode": "point",
          "limitPerWeek": 0,
          "groupName": "挑战任务",
          "getRewardMonthCount": 0,
          "getRewardTotalCount": 0,
          "channelName": "首充6元变身VIP",
          "getRewardDayCount": 0,
          "endTime": 0,
          "processScore": 0
        }, {
          "icon": "",
          "verticalCode": "iQIYI",
          "durationType": 1,
          "matchTagCount": 0,
          "continuousScore": 0,
          "button": "去评分",
          "score": 10,
          "continuousValue": 0,
          "ruleType": 0,
          "processTotalCount": 0,
          "processWeekCount": 0,
          "startTime": 0,
          "sortNum": 79,
          "id": 279,
          "exts": [{
            "name": "_URL",
            "value": "iqiyi://mobile/register_business/qyclient?pluginParams=%257B%2522biz_id%2522%253A%2522114%2522%252C%2522biz_plugin%2522%253A%2522qiyimsg%2522%252C%2522biz_params%2522%253A%257B%2522biz_statistics%2522%253A%2522%2522%252C%2522biz_dynamic_params%2522%253A%2522%2522%252C%2522biz_params%2522%253A%2522%2522%252C%2522biz_extend_params%2522%253A%2522%2522%252C%2522biz_sub_id%2522%253A%25229%2522%257D%257D"
          }, {
            "name": "clickEvent",
            "label": "",
            "value": "native"
          }, {
            "name": "icon",
            "label": "",
            "value": "http://m.qiyipic.com/common/lego/20180110/8f06ff13ca514336b4ff9f41ac92b9ea.png"
          }, {
            "name": "button",
            "label": "",
            "value": "去评分"
          }],
          "channelCode": "Rating",
          "processMonthCount": 0,
          "processCount": 0,
          "limitTotal": 0,
          "multiple": 1,
          "getRewardWeekCount": 0,
          "channelGroup": 20,
          "limitPerMonth": 0,
          "userId": 1480396200,
          "limitPerDay": 1,
          "url": "iqiyi://mobile/register_business/qyclient?pluginParams=%257B%2522biz_id%2522%253A%2522114%2522%252C%2522biz_plugin%2522%253A%2522qiyimsg%2522%252C%2522biz_params%2522%253A%257B%2522biz_statistics%2522%253A%2522%2522%252C%2522biz_dynamic_params%2522%253A%2522%2522%252C%2522biz_params%2522%253A%2522%2522%252C%2522biz_extend_params%2522%253A%2522%2522%252C%2522biz_sub_id%2522%253A%25229%2522%257D%257D",
          "typeCode": "point",
          "limitPerWeek": 0,
          "groupName": "每日任务",
          "getRewardMonthCount": 0,
          "getRewardTotalCount": 0,
          "channelName": "电影评分",
          "getRewardDayCount": 0,
          "endTime": 0,
          "processScore": 0
        }, {
          "icon": "http://pic2.iqiyipic.com/common/lego/20180723/116255fe46e749c1976703556b1f4ff0.png",
          "verticalCode": "iQIYI",
          "durationType": 1,
          "matchTagCount": 0,
          "continuousScore": 0,
          "button": "去关注",
          "score": 10,
          "continuousValue": 0,
          "ruleType": 0,
          "processTotalCount": 0,
          "processWeekCount": 0,
          "startTime": 0,
          "sortNum": 56,
          "id": 385,
          "exts": [{
            "name": "icon_new",
            "label": "",
            "value": "http://pic2.iqiyipic.com/common/lego/20180723/116255fe46e749c1976703556b1f4ff0.png"
          }, {
            "name": "reward",
            "label": "",
            "value": "vip+3"
          }, {
            "name": "button",
            "label": "",
            "value": "去关注"
          }, {
            "name": "icon",
            "label": "",
            "value": "http://m.qiyipic.com/common/lego/20180110/b0e79b3d7cab406bbf6a6b9d0ec107f5.png"
          }, {
            "name": "subhead",
            "label": "",
            "value": "热剧活动早知道"
          }, {
            "name": "clickEvent",
            "label": "",
            "value": "pop"
          }, {
            "name": "isvip",
            "label": "",
            "value": "1"
          }],
          "channelCode": "vip_wechatmp",
          "processMonthCount": 0,
          "processCount": 0,
          "limitTotal": 1,
          "multiple": 0,
          "getRewardWeekCount": 0,
          "channelGroup": 21,
          "limitPerMonth": 0,
          "userId": 1480396200,
          "limitPerDay": 1,
          "url": "pop",
          "typeCode": "point",
          "limitPerWeek": 0,
          "groupName": "挑战任务",
          "getRewardMonthCount": 0,
          "getRewardTotalCount": 0,
          "channelName": "关注微信公众号",
          "getRewardDayCount": 0,
          "endTime": 0,
          "processScore": 0
        }, {
          "icon": "http://pic3.iqiyipic.com/common/lego/20180723/3982c2d5764f428e925891c28bd1945e.png",
          "verticalCode": "iQIYI",
          "durationType": 1,
          "matchTagCount": 0,
          "continuousScore": 0,
          "button": "去开通",
          "score": 10,
          "continuousValue": 0,
          "ruleType": 0,
          "processTotalCount": 0,
          "processWeekCount": 0,
          "startTime": 0,
          "sortNum": 55,
          "id": 386,
          "exts": [{
            "name": "url_ios",
            "label": "",
            "value": "iqiyi://mobile/register_business/qyclient?pluginParams=%257B%2522biz_params%2522%253A%257B%2522biz_params%2522%253A%2522%2522%252C%2522biz_statistics%2522%253A%2522%2522%252C%2522biz_extend_params%2522%253A%2522%2522%252C%2522biz_sub_id%2522%253A%25227%2522%252C%2522biz_dynamic_params%2522%253A%2522%2522%257D%252C%2522biz_plugin%2522%253A%2522%2522%252C%2522biz_id%2522%253A%2522101%2522%257D"
          }, {
            "name": "url_android",
            "label": "",
            "value": "iqiyi://mobile/payment/order?productid=10005&autorenewtype=1"
          }, {
            "name": "_URL",
            "value": "platform"
          }, {
            "name": "icon_new",
            "label": "",
            "value": "http://pic3.iqiyipic.com/common/lego/20180723/3982c2d5764f428e925891c28bd1945e.png"
          }, {
            "name": "notes",
            "label": "",
            "value": "续费成功再送7天VIP"
          }, {
            "name": "reward",
            "label": "",
            "value": "vip+7"
          }, {
            "name": "button",
            "label": "",
            "value": "去开通"
          }, {
            "name": "icon",
            "label": "",
            "value": "http://m.qiyipic.com/common/lego/20180110/9ff4c5c227bd4c9895cd979551e45c9b.png"
          }, {
            "name": "subhead",
            "label": "",
            "value": "会员权益不间断"
          }, {
            "name": "clickEvent",
            "label": "",
            "value": "xufei"
          }, {
            "name": "isvip",
            "label": "",
            "value": "1"
          }],
          "channelCode": "vip_autocharge",
          "processMonthCount": 0,
          "processCount": 0,
          "limitTotal": 1,
          "multiple": 0,
          "getRewardWeekCount": 0,
          "channelGroup": 21,
          "limitPerMonth": 0,
          "userId": 1480396200,
          "limitPerDay": 0,
          "url": "platform",
          "typeCode": "point",
          "limitPerWeek": 0,
          "groupName": "挑战任务",
          "getRewardMonthCount": 0,
          "getRewardTotalCount": 0,
          "channelName": "开通自动续费",
          "getRewardDayCount": 0,
          "endTime": 0,
          "processScore": 0
        }, {
          "icon": "http://pic0.iqiyipic.com/common/lego/20180723/83060eae40974fada0e0e4c53b16a91a.png",
          "verticalCode": "iQIYI",
          "durationType": 1,
          "matchTagCount": 0,
          "continuousScore": 0,
          "button": "去查看",
          "score": 10,
          "continuousValue": 0,
          "ruleType": 0,
          "processTotalCount": 0,
          "processWeekCount": 0,
          "startTime": 0,
          "sortNum": 50,
          "id": 387,
          "exts": [{
            "name": "_URL",
            "value": "iqiyi://mobile/register_business/qyclient?pluginParams=%257B%2522biz_id%2522%253A%2522100%2522%252C%2522biz_plugin%2522%253A%2522qiyibase%2522%252C%2522biz_params%2522%253A%257B%2522biz_sub_id%2522%253A%2522106%2522%252C%2522biz_params%2522%253A%2522jt%253D1%2526bizId%253DtitleRNClub%2526componentName%253DRNTitleClub%2522%252C%2522biz_dynamic_params%2522%253A%2522jttuozhancanshu%2526initParams%253D%257B%255C%2522titleType%255C%2522%253A%255C%25221%255C%2522%252C%255C%2522tabId%255C%2522%253A%255C%25220%255C%2522%257D%2522%252C%2522biz_extend_params%2522%253A%2522biz_extend_params%253Djt%2522%252C%2522biz_statistics%2522%253A%2522%2522%257D%257D"
          }, {
            "name": "icon_new",
            "label": "",
            "value": "http://pic0.iqiyipic.com/common/lego/20180723/83060eae40974fada0e0e4c53b16a91a.png"
          }, {
            "name": "reward",
            "label": "",
            "value": "czz+5"
          }, {
            "name": "button",
            "label": "",
            "value": "去查看"
          }, {
            "name": "icon",
            "label": "",
            "value": "http://m.qiyipic.com/common/lego/20180110/178e8201a8f4467ea3a4ff63b9d71b88.png"
          }, {
            "name": "subhead",
            "label": "",
            "value": "即刻掌握活动信息"
          }, {
            "name": "clickEvent",
            "label": "",
            "value": "vipclub"
          }, {
            "name": "isvip",
            "label": "",
            "value": "1"
          }],
          "channelCode": "vip_memberclub",
          "processMonthCount": 0,
          "processCount": 0,
          "limitTotal": 1,
          "multiple": 0,
          "getRewardWeekCount": 0,
          "channelGroup": 21,
          "limitPerMonth": 0,
          "userId": 1480396200,
          "limitPerDay": 0,
          "url": "iqiyi://mobile/register_business/qyclient?pluginParams=%257B%2522biz_id%2522%253A%2522100%2522%252C%2522biz_plugin%2522%253A%2522qiyibase%2522%252C%2522biz_params%2522%253A%257B%2522biz_sub_id%2522%253A%2522106%2522%252C%2522biz_params%2522%253A%2522jt%253D1%2526bizId%253DtitleRNClub%2526componentName%253DRNTitleClub%2522%252C%2522biz_dynamic_params%2522%253A%2522jttuozhancanshu%2526initParams%253D%257B%255C%2522titleType%255C%2522%253A%255C%25221%255C%2522%252C%255C%2522tabId%255C%2522%253A%255C%25220%255C%2522%257D%2522%252C%2522biz_extend_params%2522%253A%2522biz_extend_params%253Djt%2522%252C%2522biz_statistics%2522%253A%2522%2522%257D%257D",
          "typeCode": "point",
          "limitPerWeek": 0,
          "groupName": "挑战任务",
          "getRewardMonthCount": 0,
          "getRewardTotalCount": 0,
          "channelName": "查看会员俱乐部",
          "getRewardDayCount": 0,
          "endTime": 0,
          "processScore": 0
        }, {
          "icon": "http://pic2.iqiyipic.com/common/lego/20180723/bef7fbff3ab8475785ff77f2a31800af.png",
          "description": "首次打开爱奇艺奇巴布，送20积分",
          "verticalCode": "iQIYI",
          "durationType": 0,
          "matchTagCount": 0,
          "continuousScore": 0,
          "button": "去下载",
          "score": 20,
          "continuousValue": 0,
          "ruleType": 0,
          "processTotalCount": 0,
          "processWeekCount": 0,
          "startTime": 0,
          "sortNum": 10,
          "id": 559,
          "exts": [{
            "name": "icon_new",
            "label": "",
            "value": "http://pic2.iqiyipic.com/common/lego/20180723/bef7fbff3ab8475785ff77f2a31800af.png"
          }, {
            "name": "isdownload",
            "label": "",
            "value": "1"
          }, {
            "name": "icon",
            "label": "",
            "value": "http://m.qiyipic.com/common/lego/20180613/c2a8097630b145e2b83df10410335296.png"
          }, {
            "name": "clickEvent",
            "label": "",
            "value": "H5"
          }, {
            "name": "URL",
            "label": "",
            "value": "http://www.iqiyi.com/common/cartoon_goto_qbb.html?taskType=point"
          }, {
            "name": "button",
            "label": "",
            "value": "去下载"
          }, {
            "name": "trans_uid",
            "label": "",
            "value": "1"
          }],
          "channelCode": "downqbb",
          "processMonthCount": 0,
          "processCount": 0,
          "limitTotal": 1,
          "multiple": 0,
          "getRewardWeekCount": 0,
          "channelGroup": 21,
          "limitPerMonth": 0,
          "userId": 1480396200,
          "limitPerDay": 0,
          "url": "http://www.iqiyi.com/common/cartoon_goto_qbb.html?taskType=point",
          "typeCode": "point",
          "limitPerWeek": 0,
          "groupName": "挑战任务",
          "getRewardMonthCount": 0,
          "getRewardTotalCount": 0,
          "channelName": "体验爱奇艺奇巴布",
          "getRewardDayCount": 0,
          "endTime": 0,
          "processScore": 0
        }, {
          "icon": "",
          "verticalCode": "iQIYI",
          "durationType": 1,
          "matchTagCount": 0,
          "continuousScore": 0,
          "button": "看小说",
          "score": 2,
          "continuousValue": 0,
          "ruleType": 0,
          "processTotalCount": 1,
          "processWeekCount": 0,
          "startTime": 0,
          "sortNum": 9,
          "id": 382,
          "exts": [{
            "name": "_URL",
            "value": "iqiyi://mobile/register_business/lightreader?pluginParams=%257B%2522biz_id%2522%253A12%252C%2522biz_plugin%2522%253A%2522com.qiyi.lightning%2522%252C%2522biz_params%2522%253A%257B%2522biz_sub_id%2522%253A1%252C%2522biz_params%2522%253A%2522bookId%253Dxxx%2522%252C%2522biz_statistics%2522%253A%2522sourceType%253D3%2522%257D%257D"
          }, {
            "name": "isDownload",
            "label": "",
            "value": "0"
          }, {
            "name": "notes",
            "label": "",
            "value": "sdgsdg故事梗概   的风格的非官方"
          }, {
            "name": "button",
            "label": "",
            "value": "看小说"
          }, {
            "name": "clickEvent",
            "label": "",
            "value": "novel"
          }, {
            "name": "tasklistType",
            "label": "",
            "value": "default"
          }, {
            "name": "icon",
            "label": "",
            "value": "http://m.qiyipic.com/common/lego/20171127/4dceeb0d897340fe8eabfd1e0f8f0d71.png"
          }],
          "channelCode": "go_novel_home",
          "processMonthCount": 0,
          "processCount": 0,
          "limitTotal": 0,
          "multiple": 0,
          "getRewardWeekCount": 0,
          "channelGroup": 20,
          "limitPerMonth": 0,
          "userId": 1480396200,
          "limitPerDay": 1,
          "url": "iqiyi://mobile/register_business/lightreader?pluginParams=%257B%2522biz_id%2522%253A12%252C%2522biz_plugin%2522%253A%2522com.qiyi.lightning%2522%252C%2522biz_params%2522%253A%257B%2522biz_sub_id%2522%253A1%252C%2522biz_params%2522%253A%2522bookId%253Dxxx%2522%252C%2522biz_statistics%2522%253A%2522sourceType%253D3%2522%257D%257D",
          "typeCode": "point",
          "limitPerWeek": 0,
          "groupName": "每日任务",
          "getRewardMonthCount": 0,
          "getRewardTotalCount": 1,
          "channelName": "看轻小说",
          "getRewardDayCount": 0,
          "endTime": 0,
          "processScore": 0
        }]
      }
    }
  },
};
