/**
 *
 * @ref
 * @origin /punchTask/detail
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
      "punchedBefore": false,
      "userVoteNumber": 0,
      "scorePool": 1340,
      "votedBefore": true,
      "timestamp": 1554998465406,
      "recentVoteUsers": []
    }
  },
};
