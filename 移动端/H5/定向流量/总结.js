/*

1.$.ajax的请求参数timeout: 5e3,代表5s不出结果就报错。然后就出了订购成功但出了error里的问题

后端设了nginx转发到联通的接口，很可能延迟5s以上甚至10s以上

2.成功回调用mapservice的trigger通知，然后别的地方mapservice的on来处理

3.在//statics-web.iqiyi.com/common/jssdk/iqiyiJsBridge-v2-min.js，iqiyi的ready和init都能进入成功回调
在//static.iqiyi.com/js/common/iqiyiJsBridge.min.js不行
下面代码放在init里面才能生效
iqiyi.commonInvoke( //兼容小程序，隐藏当前页面分享按钮
    'JSBRIDGE_VIRTUAL_SWAN', {
    'action': "shareHide"
    },
    function(data) {console.log(data.data)}
);  

*/