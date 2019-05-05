/**
 *
 * @ref 用户金币查询
 * @origin userMoney
 * Created by liuzhimeng on 2019/01/05.
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
        current: 10000
      }
    }
  },
};
