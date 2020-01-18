/*

1.


2.定位相关：https://qiuxiang.github.io/react-native-amap-geolocation/#/?id=%e4%b8%8b%e8%bd%bd-ios-sdk
定位装ios sdk：https://lbs.amap.com/api/ios-location-sdk/guide/create-project/manual-configuration
记得加个path，"$(SRCROOT)"可以指向ios目录找framework
* 用react-native-location靠谱：https://blog.csdn.net/weixin_42600398/article/details/95373057
* rn自带的Geolocation也可以

3.高德逆地理编码接口拿到经纬度对应的地址
http.get('https://restapi.amap.com/v3/geocode/regeo', {
    output: 'json',
    location: `${longitude},${latitude}`,
    key: '51abd276468d92d49adb42ee33da9861',
    radius: 1000,
    extensions: 'all'
})

*/