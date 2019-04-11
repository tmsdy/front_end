/*

1.$.ajax的请求参数timeout: 5e3,代表5s不出结果就报错。然后就出了订购成功但出了error里的问题

后端设了nginx转发到联通的接口，很可能延迟5s以上甚至10s以上

2.成功回调用mapservice的trigger通知，然后别的地方mapservice的on来处理

*/