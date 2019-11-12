/*

1.View包一层TouchableOpacity才能用onPress,Text可以直接用onPress

2.TextInput的组件
 1）在Android上输入文字被遮挡住，直接在TextInput的样式上加padding:0就行
 2）安卓上如果设置multiline = {true}，文本默认会垂直居中，可设置textAlignVertical: 'top'样式来使其居顶显示。

3.动态require本地图片的思路：https://www.jianshu.com/p/9612b5608183

4.switch组件必须设置绑定的状态值，并要在切换状态的时候改变状态值

5.首行缩进2个字
<Text style={styles.newsDetail}>
  {'\u3000\u3000'}橙战企业版将在双11活动活动期间购买的用户，提供价值2000元的优惠活动，具体参加方式橙战企业版将在双11活动活动期间购买的用户，提供价值2000元的优惠活动，具体参加方式橙战企业版将在
</Text>

6.ant-design-mobile-rn的Tabs组件的坑
requireNativeComponent: 'RNCVIewPager' was not found in the UIManager
issue：https://github.com/ant-design/ant-design-mobile-rn/issues/663
https://github.com/react-native-community/react-native-viewpager/issues/18

2.


*/