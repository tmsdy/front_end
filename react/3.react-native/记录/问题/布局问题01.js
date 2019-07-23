/*
http://www.cocoachina.com/articles/11608

1.文字必须放在Text里面，还默认占满一行

2.元素加上flexDirection就变成flex元素了，如果不设宽度，默认占满父级元素

3.image的resizeMode:‘cover’,‘contain’,‘stretch’,‘repeat’,‘center'
stretch：按给定的宽高延展图片
contain：按图片的原始宽高按比例展示

4.给盒子加阴影,https://blog.csdn.net/SpicyBoiledFish/article/details/76079556
ios:
shadowColor: '#FF5C00',
shadowOpacity: 0.5,
shadowRadius: 15, //阴影模糊半径
shadowOffset: {
    width: 0, //x偏移
    height: 4, //y偏移
},
安卓：不支持阴影，得用react-native-shadow, react-native-svg插件

*/
