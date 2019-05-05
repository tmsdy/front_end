/**
 *
 * @ref 8.6、查询用户历史累计消费金币总额
 * @origin userMoneySummaryConsume
 * Created by liuzhimeng on 2019/01/24.
 */
module.exports = {
  delay: 0, // 延迟(ms)
  pipe: (params, response) => { // 响应返回前的处理管道
    return response;
  },
  response: {
    code: 'A00000',
    data: {
      code: 'A0000',
      message: null,
      data: {
        total: 888.88,
      },
    },
  },
};
