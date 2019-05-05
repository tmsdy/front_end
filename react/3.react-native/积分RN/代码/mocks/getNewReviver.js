/**
 *
 * @ref 用户是否获得复活肥、提现卡、集宝卡
 * @origin getNewReviver
 * Created by liuzhimeng on 2019/01/12.
 */
module.exports = {
  delay: 0, // 延迟(ms)
  pipe: (params, response) => { // 响应返回前的处理管道
    return response;
  },
  response: {
    code: 'A00000',
    data: {
      newReviverNum: 0, // 复活肥
      newWithdrawNum: 0, // 提现卡
      moneyChip: 0, // 集宝卡
      newSpeederNum: 0, // 加速液
    },
  },
};
