/**
 *
 * @ref
 * @origin flowerDiaryGetDiary
 * Created by linnyli on 2019/01/22.
 */
module.exports = {
  delay: 0, // 延迟(ms)
  pipe: (params, response) => { // 响应返回前的处理管道
    return response;
  },
  // emotion: happy, down, normal
  response: {
    code: 'A00000',
    data: {
      code: 'A00000',
      total: 14,
      "contents": [
        {
            "userId": 1381293754,
            "type": 5,
            "timestamp": 1547548283496,
            "content": "花生酱不是酱捕捉了你的蜜蜂，获得金钱花碎片",
            "channelCode": "rose",
            "extInfo": {
                "friendId": 1434353534,
                "emotion":"happy"
            }
        },
        {
            "userId": 1381293754,
            "type": 5,
            "timestamp": 1547548262945,
            "content": "花生酱不是酱捕捉了你的蜜蜂，获得道具复活化肥",
            "channelCode": "rose",
            "extInfo": {}
        },
        {
            "userId": 1381293754,
            "type": 5,
            "timestamp": 1547548217820,
            "content": "花生酱不是酱捕捉了你的蜜蜂，获得积分2",
            "channelCode": "rose",
            "extInfo": {}
        },
        {
            "userId": 1381293754,
            "type": 1,
            "timestamp": 1547466423920,
            "content": "花生酱不是酱用户昵称花了5积分给我浇水了呢，要不去看看TA的花儿长什么样",
            "channelCode": "rose",
            "extInfo": {}
        }
    ]
    }
  },
};
