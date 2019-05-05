/**
 *
 * @ref
 * @origin relationAddFriend_new
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
      data: {
        success: true,
      },
      newReviver: true,
    }
  },
};
