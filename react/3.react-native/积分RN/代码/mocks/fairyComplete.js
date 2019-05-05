/**
 * 蜜蜂出现接口
 * @ref http://wiki.qiyi.domain/pages/viewpage.action?pageId=226398062
 * @origin fairyComplete
 * Created by xushichao on 2018/12/13.
 */
const friendList = require('./flower_friendList').response.data.contents;

module.exports = {
  delay: 0, // 延迟(ms)
  pipe: (params, response) => { // 响应返回前的处理管道
    let friendInfo = friendList.find(item => item.userId === params.fairyComplete.userId);
    if(friendInfo) {
      Object.assign(response.data.data, {
        morphCode: friendInfo.appeared ? 'bee_flower' : '', // 好友的蜜蜂
      })
    }
    return response;
  },
  response: {
    code: 'A00000',
    'data': {
      'code': 'A0000',
      'message': null,
      'data': {
        'morphCode': 'bee_point', // bee_point 积分（金币蜜蜂）  bee_flower （养花道具的蜜蜂）bee_ad（广告道具的蜜蜂）
      },
    },
  },
};
