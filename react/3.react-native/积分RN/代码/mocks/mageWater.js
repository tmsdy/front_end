/**
 * 浇花
 * @ref http://wiki.qiyi.domain/pages/viewpage.action?pageId=226398062
 * @origin mageWater
 * Created by xushichao on 2018/12/12.
 */
const _ = require('lodash')
const mageStats = require('./mageStats')
let mageStatsData = mageStats.response.data.data.current;

const getWaterDays = () => {
  const {statusCode} = mageStatsData
  if(statusCode <= 0) return 1
  if(statusCode === 3) return 9
  return statusCode
}

module.exports = {
  delay: 0, // 延迟(ms)
  pipe: (params, response) => { // 响应返回前的处理管道
    let mageStatsData = mageStats.pipe({...params, ...{mageStats: params.mageWater}}, _.cloneDeep(mageStats.response)).data.data.current;
    Object.assign(response.data.data, {
      waterDays: mageStatsData.waterDays + 1,
      statusCode: getWaterDays(),
      lottery: {
        ...mageStatsData.lottery,
        type: mageStatsData.waterDays === 20 ? 1 : mageStatsData.lottery.type,
      }
    });
    return response;
  },
  response: {
    'code': 'A00000',
    'data': {
      'code': 'A0000',
      'message': null,
      'data': {
        'vip': mageStatsData.vip, // 本次浇水获得了x天的VIP，只有第21天才有
        'lottery': mageStatsData.lottery,
        'reviveTotalCount': mageStatsData.reviveTotalCount + 1,
        'reviveTotalLimit': mageStatsData.reviveTotalLimit,
        'speedTotalCount': mageStatsData.speedTotalCount + 1,
        'speedTotalLimit': mageStatsData.speedTotalLimit,
        'speedDayCount': mageStatsData.speedDayCount + 1,
        'speedDayLimit': mageStatsData.speedDayLimit,
        'moneyRed': 888, // 浇水后出现彩蛋红包
        'verticalCode': 'iQIYI',
        'typeCode': 'point',
        'channelCode': 'flower_new',
        'wateredToday': true, // 今天是否已经浇水
        'waterDays': mageStatsData.waterDays, // 当前连续浇水天数
        'waterDaysBeforeDeath': mageStatsData.waterDaysBeforeDeath, // 花儿临死前连续浇水天数（仅当花儿当前状态为死掉了，这个属性才有意义）
        'maxWaterDays': mageStatsData.maxWaterDays, //最大连续浇水周期
        'statusCode': mageStatsData.statusCode, // 状态码: 0=种子, 1=发芽, 2=成长中, 3=成熟了, 9=可以收获了, -1=死掉了
        'statusCodeBeforeDeath': mageStatsData.statusCodeBeforeDeath, // 花儿死前的状态（仅当花儿当前状态为死掉了，这个属性才有意义）
        'name': '有才花',
        'description': '有才花，学名叫【脑子有洞菜花】。盛产于爱奇艺评论区。此话出现，经常伴随评论回复10w+，点赞88w+。',
        'waterCostScore': mageStatsData.waterCostScore, // 浇一次花耗费的积分值
        'gifts': mageStatsData.gifts,
        'beeCode': mageStatsData.beeCode,     //关联的蜜蜂任务编码
        'exts': []
      }
    },
  },
};
