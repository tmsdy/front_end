
/*

1.目的：想统计各个模块用户的进入情况
本来是想通过各个页面的展示数量来体现的，不过展示需要发送请求捕捉请求url才能计入，
但是由于vue的单页面路由切换是不发请求的，所以捕捉不到，然后我打算通过统计各个tab的点击情况来做
有个缺点就是由于第一个tab是默认的，所以会导致统计的数量偏少

*/