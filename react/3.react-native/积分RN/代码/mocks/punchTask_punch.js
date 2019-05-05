/**
 *
 * @ref
 * @origin /punchTask/punch
 * Created by linnyli on 2019/04/10.
 */
module.exports = {
  delay: 0, // 延迟(ms)
  pipe: (params, response) => { // 响应返回前的处理管道
    return response;
  },
  response: {
    code: 'A00000',
    "data": {
      "votedBefore": true,
      "punchSuccessfully": true,
      "punchedBefore": false,
      "userVoteNumber": 3,
      "totalVoteNumber": 98,
      "scorePool": 980,
      "punchedNumber": 0,
      "timestamp": 1554998465864
    }
  },
};
