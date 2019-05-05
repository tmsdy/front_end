/**
 * 捕捉蜜蜂接口
 * @ref http://wiki.qiyi.domain/pages/viewpage.action?pageId=226398062
 * @origin fairyGetReward
 * Created by xushichao on 2018/12/13.
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
      "message": null,
      "data": {
        "rewardType": 1,            //1=奖励积分，2=奖励道具
        "rewardScore": 10,           //奖励的积分数
        "itemId": null,             //奖励的道具ID
        "itemName": '满百减十券',           //奖励的道具名称
        "itemCount": null,          //奖励的道具数量
        "itemType": null,
        "itemSubType": null,        // type和subType一起区分道具类别，前端决定跳转
      }
    }
  },
};
