/**
 *
 * @ref
 * @origin growthDfpScoreDfpLoginTransfer
 * Created by liuzhimeng on 2019/04/30.
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
      "code": "A0000",
      "data": {
        "score": 5,
        "code": "A0000",
        "trdetailList": null,
        "trlotDetailList": null,
        "rewardCode": null,
        "message": "设备指纹积分转移成功",
        "typeCode": "point",
        "channelCode": ""
      },
      "t": 1556605383970,
      "message": null
    }
  },
};
