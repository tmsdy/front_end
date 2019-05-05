/**
 *
 * @ref
 * @origin mageHandbooks
 * Created by linnyli on 2019/03/04.
 */
module.exports = {
  delay: 0, // 延迟(ms)
  pipe: (params, response) => { // 响应返回前的处理管道
    return response;
  },
  response: {
    code: 'A00000',
    "data": {
      "code": "A0000",
      "data": [{
        "poem": "",
        "maxDays": 21,
        "plants": 1,
        "fruit": "现金红包",
        "maxStat": 9,
        "name": "金钱花浇水任务",
        "planting": true,
        "description": null,
        "completes": 1,
        "keepDays": 21,
        "channelCode": "money"
      }, {
        "poem": "这是花语字段",
        "maxDays": 21,
        "plants": 1,
        "fruit": "爱奇艺会员天卡",
        "maxStat": -1,
        "name": "初代花浇水任务",
        "planting": true,
        "description": "这是任务描述字段",
        "completes": 0,
        "keepDays": 0,
        "channelCode": "rose"
      }],
      "message": null
    }
  },
};
