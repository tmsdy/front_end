/**
 *
 * @ref 签到接口
 * @origin /openApi/score/add
 * Created by liuzhimeng on 2019/04/24.
 */
module.exports = {
  delay: 0, // 延迟(ms)
  pipe: (params, response) => { // 响应返回前的处理管道
    return response;
  },
  response: {
    "code": "A00000",
    "message": "成功执行.",
    "data": [{
      "code": "A0002",
      "trdetailList": null,
      "curTRDetail": null,
      "trlotDetailList": null,
      "nextTRLotDetail": null,
      "message": "任务次数已经到达上限",
      "curTRLotDetail": null,
      "nextTRDetail": null,
      "typeCode": "point",
      "continuousScore": 0,
      "score": 0,
      "continuousValue": 0,
      "rewardCode": null
    }]
  },
};
