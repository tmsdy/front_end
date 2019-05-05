/*
 * @Author: duyanren
 * @LastEditors: duyanren
 * @Description: 抽奖
 * @Date: 2019-04-22 13:11:31
 * @LastEditTime: 2019-04-22 13:12:05
 */

module.exports = {
  delay: 0, // 延迟(ms)
  pipe: (params, response) => {
    // 响应返回前的处理管道
    return response;
  },
  response: {
    code: 'A00000',
    data: {
      rewardInfo: {
        rewardType: 'DAOJU', // 奖励类型，为DAOJU或MEMBERSHIP或SCORE
        itemId: 2719, //
        rewardDescription: '测试奖品33333',
        redeemCode: 'xxxx-xxxx-xxxx-1690',
        orderNo: 'u1432384644t1513244610630re993',
        daojuType: '4', // 当奖励类型为DAOJU时，返回道具商品类型
        daojuSubType: '11', // 当奖励类型为DAOJU时，返回道具商品子类型
        picture: 'http://pic0.iqiyipic.com/common/lego/20180702/6991707e670448da86abfbe98fb704a5.jpg' // 当奖励类型为DAOJU时，返回道具商品key为”flowerLotteryPic“的图片地址
      },
      winReward: true
    },
    message: '接口执行成功'
  }
};
