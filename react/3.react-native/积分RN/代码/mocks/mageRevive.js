/**
 *
 * @ref
 * @origin mageRevive
 * Created by linnyli on 2018/12/20.
 */
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
      "data": {
        "verticalCode": "iQIYI",
        "typeCode": "point",
        "channelCode": "flower_new",
        "wateredToday": true, // 今天是否已经浇水
        "waterDays": 1, // 当前连续浇水天数
        "waterDaysBeforeDeath": 1, // 花儿临死前连续浇水天数（仅当花儿当前状态为死掉了，这个属性才有意义）
        "maxWaterDays": 21, //最大连续浇水周期
        "statusCode": 1, // 状态码: 0=种子, 1=发芽, 2=成长中, 3=成熟了, 9=可以收获了, -1=死掉了
        "statusCodeBeforeDeath": -1, // 花儿死前的状态（仅当花儿当前状态为死掉了，这个属性才有意义）
        "name": "有才花",
        "description": "有才花，学名叫【脑子有洞菜花】。盛产于爱奇艺评论区。此话出现，经常伴随评论回复10w+，点赞88w+。",
        "waterCostScore": 20, // 浇一次花耗费的积分值
        'beeCode': 'Bee1',     //关联的蜜蜂任务编码
        "gifts": [ // <---这里是奖励，就是点那个大礼包
            {
                "days": 3, // 所需的连续浇水天数
                "status": 1, // 状态码：0=未解锁，1=已解锁，9=已领取, -1=已过期
                "score": 10 // 奖励的分值
            },
            {
                "days": 7,
                "status": 0,
                "score": 20
            },
            {
                "days": 12,
                "status": 0,
                "score": 30
            }
        ],
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
