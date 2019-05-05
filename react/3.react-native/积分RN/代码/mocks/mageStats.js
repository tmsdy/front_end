/**
 * 花儿状态
 * @ref http://wiki.qiyi.domain/pages/viewpage.action?pageId=226398062
 * @origin mageStats
 * Created by xushichao on 2018/12/12.
 */
const friendList = require('./flower_friendList').response.data.contents;

module.exports = {
  delay: 0, // 延迟(ms)
  pipe: (params, response) => { // 响应返回前的处理管道
    let friendInfo = friendList.find(item => item.userId === params.mageStats.userId);
    if(friendInfo) {
      response.data.data.newborn = false;
      Object.assign(response.data.data.current, {
        wateredToday: friendInfo.wateredToday,
        statusCode: friendInfo.statusCode,
        channelCode: friendInfo.channelCode,
      })
    }
    return response;
  },
  response: {
    'code': 'A00000',
    'data': {
      'code': 'A0000',
      'message': null,
      'data': {
        'totalScore': 120,
        'newborn': false,
        'available': ['money', 'rose'], // 当前可种植的花儿列表 种花接口传数组第一个
        'seeds': [
          {
            'channelCode': 'genius',
            'name': '有才花',
            'description': '我是有才花描述文字',
            'poem': '我是有才花花语',
            'completes': 0,
            'maxDays': 21,
            'keepDays': 0,
            'maxStat': 0,
            'planting': false,
            'plants': 0,
            'fruit': null
          },
          {
            'channelCode': 'rose',
            'name': '初代花',
            'description': '初代花是乐园第一朵花儿，它很皮，高冷还傲娇，纤细又敏感。养成它真是很不容易的一件事',
            'poem': '初代花是乐园第一朵花儿，它很皮，高冷还傲娇，纤细又敏感。养成它真是很不容易的一件事',
            'completes': 0,
            'maxDays': 21,
            'keepDays': 4,
            'maxStat': 1,
            'planting': true,
            'plants': 5,
            'fruit': null
          }
        ],
        'current': {
          'verticalCode': 'iQIYI',
          'typeCode': 'point',
          'channelCode': 'genius',
          'wateredToday': false, // 今天是否已经浇水
          'waterDays': 2, // 当前连续浇水天数
          'waterDaysBeforeDeath': 20, // 花儿临死前连续浇水天数（仅当花儿当前状态为死掉了，这个属性才有意义）
          'maxWaterDays': 21, //最大连续浇水周期
          'statusCode': 2, // 状态码: 0=种子, 1=发芽, 2=成长中, 3=成熟了, 9=可以收获了, -1=死掉了
          'statusCodeBeforeDeath': 1, // 花儿死前的状态（仅当花儿当前状态为死掉了，这个属性才有意义）
          'name': '有才花',
          'description': '有才花，学名叫【脑子有洞菜花】。盛产于爱奇艺评论区。此话出现，经常伴随评论回复10w+，点赞88w+。',
          'waterCostScore': 15, // 浇一次花耗费的积分值
          'beeCode': 'Bee1',     //关联的蜜蜂任务编码
          'vip': 0, // 本次浇水获得了x天的VIP，只有第21天才有
          'lottery': { // 本次浇水得到了抽奖奖励哦， 如果这个为null，那么表示没有奖励哦。
            'id': 77778888, // 抽奖的回执ID, 用于实际的领取调用。
            'type': 0, // 奖品类型枚举: 积分=0, VIP=1, 道具=2, 花儿道具=3
            'amount': 456, // 奖品数量
            'image': 'http://pic0.iqiyipic.com/common/lego/20180702/6991707e670448da86abfbe98fb704a5.jpg', // 优惠券图片
            'description': 'mock积分',  // 奖品描述信息
            'confirmable': true, // 是否需要确认，仅当ture时，需要前端调用奖品领取接口执行领取，否则该奖品为自动发放，无需调用（当然你调用一下也没关系的）,
            // 中奖type为3（花儿道具时）使用
            'raw': {
              'rewardType': 'DAOJU', // 奖励类型，为DAOJU或MEMBERSHIP或SCORE
              'itemId': 2719, //
              'rewardDescription': '测试奖品33333',
              'redeemCode': 'xxxx-xxxx-xxxx-1690',
              'orderNo': 'u1432384644t1513244610630re993',
              'daojuType': 4, // 当奖励类型为DAOJU时，返回道具商品类型
              'daojuSubType': 18, // 当奖励类型为DAOJU时，返回道具商品子类型，18：复活卡，19：提现卡
              'picture': 'http://pic0.iqiyipic.com/common/lego/20180702/6991707e670448da86abfbe98fb704a5.jpg'  // 当奖励类型为DAOJU时，返回道具商品key为”flowerLotteryPic“的图片地址
            },
          },
          'reviveTotalCount': 1,
          'reviveTotalLimit': 7,
          'speedTotalCount': 1,
          'speedTotalLimit': 7,
          'speedDayCount': 1,
          'speedDayLimit': 2,
          'gifts': [
            {
              'days': 3, // 所需的连续浇水天数
              'status': 1, // 状态码：0=未解锁，1=已解锁，9=已领取, -1=已过期
              'score': 12, // 奖励的分值
              'type': 0, // 奖励币种: 0=积分(默认), 1=金币
            },
            {
              'days': 7,
              'status': 0,
              'score': 20,
              'type': 1,
            },
            {
              'days': 12,
              'status': 0,
              'score': 30,
              'type': 1,
            },
            {
              'days': 20,
              'status': 1,
              'score': 30,
              'type': 1,
            },
          ],
          'notes': {
            'calNotice': [
              {'days': 1, 'notice': '花期1'},
              {'days': 4, 'notice': '花期4'},
              {'days': 10, 'notice': '花期10'},
              {'days': 21, 'notice': '花期21'},
            ],
          },
          'exts': [
            {'name': 'hello', 'value': 'world', 'label': null},
            {'name': 'foo', 'value': 'bar', 'label': null},
            {'name': 'daysTip_3', 'value': '当天花儿会结出果实哦3', 'label': null},
            {'name': 'daysTip_7', 'value': '当天花儿会结出果实哦7', 'label': null},
            {'name': 'daysTip_12', 'value': '当天花儿会结出果实哦12', 'label': null},
            {'name': 'daysTip_20', 'value': '当天花儿会结出果实哦20', 'label': null},
            {'name': 'ios-daysTip_21', 'value': '当天花儿会结出果实哦21_ios', 'label': null},
            {'name': 'android-daysTip_21', 'value': '当天花儿会结出果实哦21_android', 'label': null},
          ],
        },
      },
    },
  },
};
