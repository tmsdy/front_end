/**
 *
 * @ref
 * @origin flowerDiaryHasNewDiary
 * Created by linnyli on 2019/01/22.
 */
module.exports = {
  delay: 0, // 延迟(ms)
  pipe: (params, response) => { // 响应返回前的处理管道
    return response;
  },
  response: {
    code: 'A00000',
    data: {
      "code": "A00000",
      "data": {
        "hasNew": false
      }
    }
  },
};
