/*

请注意对于网络和 base64 数据的图片需要手动指定尺寸！

<Image>标签加载图片的方式
加载本项目里的：<Image source={require('./img/icon.jpg')}/>
加载网络图片：<Image source={{uri: 'http://..................*.jpg'}}/>
加载本地图片：<Image source={{uri: 'file://' + path}}/>

图片不显示：https://www.jianshu.com/p/85addb267b5b

安卓加载网络图片有时候展示有时候不展示
图片要指定宽高，大图片会出现不显示的情况

image的resizeMode:‘cover’,‘contain’,‘stretch’,‘repeat’,‘center'
stretch：按给定的宽高延展图片
contain：按图片的原始宽高按比例展示 这个会导致圆角不圆
cover：这个用的多

动态require本地图片的思路：https://www.jianshu.com/p/9612b5608183


*/