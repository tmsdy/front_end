/**
 *
 * @ref
 * @origin relationAddFriend_v3
 * Created by liuzhimeng on 2019/01/28.
 */
module.exports = {
  delay: 0, // 延迟(ms)
  pipe: (params, response) => { // 响应返回前的处理管道
    return response;
  },
  response: {
    code: 'A00000',
    data: {
      data: {
        success: true,
      },
      newReviver: false,
      newMoneyChip: false,
      newSpeeder: false,
    }
  },
};
