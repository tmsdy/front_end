/**
 * 种花
 * @ref http://wiki.qiyi.domain/pages/viewpage.action?pageId=226398062
 * @origin magePlant
 * Created by xushichao on 2018/12/13.
 */
const mageStats = require('./mageStats');
let mageStatsData = mageStats.response.data.data.current;

module.exports = {
  delay: 0, // 延迟(ms)
  pipe: (params, response) => { // 响应返回前的处理管道
    return response;
  },
  response: {
    "code": "A00000",
    "message": null,
    "data": {
      "code": "A0000",
      "message": null,
      "data": {
        "verticalCode": "iQIYI",
        "typeCode": "point",
        "channelCode": "flower_new",
        "wateredToday": false, // 今天是否已经浇水
        "waterDays": mageStatsData.waterDays, // 当前连续浇水天数
        "maxWaterDays": mageStatsData.maxWaterDays, //最大连续浇水周期
        "waterDaysBeforeDeath": mageStatsData.waterDaysBeforeDeath, // 花儿临死前连续浇水天数（仅当花儿当前状态为死掉了，这个属性才有意义）
        "statusCode": 0, // 状态码(这里肯定等于0的啦，因为刚种下去嘛): 0=种子, 1=发芽, 2=成长中, 3=成熟了, 9=可以收获了, -1=死掉了
        "statusCodeBeforeDeath": mageStatsData.statusCodeBeforeDeath, // 花儿死前的状态（仅当花儿当前状态为死掉了，这个属性才有意义）
        "name": "有才花",
        "description": "有才花，学名叫【脑子有洞菜花】。盛产于爱奇艺评论区。此话出现，经常伴随评论回复10w+，点赞88w+。",
        "waterCostScore": mageStatsData.waterCostScore, // 浇一次花耗费的积分值
        "gifts": mageStatsData.gifts,
        'beeCode': mageStatsData.beeCode,     //关联的蜜蜂任务编码
        "exts": [
          {
            "name": "hello",
            "value": "world",
            "label": null
          },
          {
            "name": "foo",
            "value": "bar",
            "label": null
          }
        ]
      }
    }
  },
};
