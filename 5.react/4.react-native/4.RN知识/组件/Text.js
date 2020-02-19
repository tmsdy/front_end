/*

1.numberOfLines 配合 maxWidth做超出省略
<Text style={{ ...styles.gray12, maxWidth: px2dp(280) }} numberOfLines={1}>

2.文字必须放在Text里面，还默认占满一行

3.首行缩进2个字
<Text style={styles.newsDetail}>
  {'\u3000\u3000'}橙战企业版将在双11活动活动期间购买的用户，提供价值2000元的优惠活动，具体参加方式橙战企业版将在双11活动活动期间购买的用户，提供价值2000元的优惠活动，具体参加方式橙战企业版将在
</Text>

*/