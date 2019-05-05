/**
 *
 * @ref 获取深度任务code列表
 * @origin qipu_deep_task_list
 * Created by liuzhimeng on 2019/04/28.
 */
module.exports = {
  delay: 0, // 延迟(ms)
  pipe: (params, response) => { // 响应返回前的处理管道
    return response;
  },
  response: {
    "code": "A00000",
    "message": "成功执行.",
    "validateResult": true,
    "data": {
      "elements_summary": [{
        "update_time": 1554175131000,
        "key_value_pair": [{
          "name": "platform",
          "value": "1,2,3,4,5,6"
        }, {
          "name": "sequencename",
          "value": "doudizhu"
        }],
        "entity_id": -10417057712,
        "order": 2
      }, {
        "update_time": 1554175139000,
        "key_value_pair": [{
          "name": "platform",
          "value": "1,2,3,4,5,6"
        }, {
          "name": "sequencename",
          "value": "majiang"
        }],
        "entity_id": -14061263612,
        "order": 3
      }, {
        "update_time": 1554175152000,
        "key_value_pair": [{
          "name": "platform",
          "value": "1,2,3,4,5,6"
        }, {
          "name": "sequencename",
          "value": "card"
        }],
        "entity_id": -14061298812,
        "order": 6
      }, {
        "update_time": 1554175151000,
        "key_value_pair": [{
          "name": "platform",
          "value": "1,2,3,4,5,6"
        }, {
          "name": "sequencename",
          "value": "borrow"
        }],
        "entity_id": -14061198412,
        "order": 5
      }, {
        "update_time": 1554175145000,
        "key_value_pair": [{
          "name": "platform",
          "value": "1,2,3,4,5,6"
        }, {
          "name": "sequencename",
          "value": "xsd"
        }],
        "entity_id": -15945461512,
        "order": 4
      }, {
        "update_time": 1554175128000,
        "key_value_pair": [{
          "name": "platform",
          "value": "1,2,3,4,5,6"
        }, {
          "name": "sequencename",
          "value": "yxr"
        }],
        "entity_id": -16289070012,
        "order": 1
      }],
      "id": 10417006412
    }
  },
};
