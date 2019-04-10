/*

1.bundle.js原本108kb有了gzip压缩压缩到30+kb了，压缩的越狠说明没用到的代码越多

2.爱奇艺这里：容器会拦截引入了官方地址的 jssdk，并替换成内置的 jssdk。

调 goToApp({type: 'pageName', value: 'MyGain'}) 生成的 defaultConfig 如下：
{
    COVER_IMG: "https://statics-web.iqiyi.com/h5/integralh5/res/img/browser_open.png"
    FAILBACK: {
        IOS: "https://itunes.apple.com/cn/app/id393765873?mt=8", 
        ANDROID: "//mbdapp.iqiyi.com/j/ap/iqiyi_1845.apk"
    }
    SCHEME: "iqiyi://mobile/register_business/qyclient?pluginParams=%257B%2522biz_id%2522%253A100%252C%2522biz_plugin%2522%253A%2522qiyibase%2522%252C%2522biz_params%2522%253A%257B%2522biz_sub_id%2522%253A106%252C%2522biz_params%2522%253A%2522bizId%253DIntegralRN%2526componentName%253DRNIntegral%2522%252C%2522biz_dynamic_params%2522%253A%2522initParams%253D%257B%255C%2522pageName%255C%2522%253A%255C%2522MyGain%255C%2522%257D%2522%257D%257D"
    TIMEOUT: 2000
}
发SCHEME通信
走到里面
window.location.href：
    "iqiyi://mobile/register_business/qyclient?pluginParams=%257B%2522biz_id%2522%253A100%252C%2522biz_plugin%2522%253A%2522qiyibase%2522%252C%2522biz_params%2522%253A%257B%2522biz_sub_id%2522%253A106%252C%2522biz_params%2522%253A%2522bizId%253DIntegralRN%2526componentName%253DRNIntegral%2522%252C%2522biz_dynamic_params%2522%253A%2522initParams%253D%257B%255C%2522pageName%255C%2522%253A%255C%2522MyGain%255C%2522%257D%2522%257D%257D"

3.背景图不够长，用background-size: cover就行了，需要手动加前缀，iPhone X在app中打开有问题，在浏览器中打开正常
原因：iPhoneX适配 wkWebView屏幕下方有间隙的问题
解决方法：meta 加 viewport-fit=cover，body加padding-bottom: constant(safe-area-inset-bottom);
https://blog.csdn.net/yelin042/article/details/79837757

*/