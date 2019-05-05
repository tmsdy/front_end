/*
 * @Author: duyanren
 * @LastEditors: duyanren
 * @Description: 抽奖信息mock
 * @Date: 2019-04-21 15:00:19
 */

module.exports = {
  delay: 0, // 延迟(ms)
  pipe: (params, response) => {
    // 响应返回前的处理管道
    return response;
  },
  response: {
    code: 'A00000',
    data: [
      {
        username: 'test',
        product: '商品1',
        helperWeChatNickName: '金丹丹的谎言',
        infoType: 'LOTTERY' // 信息类型  LOTTERY 为抽奖结果信息， BOOST为助力氛围信息
      },
      {
        username: '水水0324',
        product: null,
        helperWeChatNickName: '水水wwww',
        infoType: 'BOOST'
      }
    ],
    message: '接口执行成功'
  }
};
