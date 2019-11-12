/*

1.html的img的src为空处理，避免谷歌浏览器有边框
解决办法：添加全局样式：img[src=""],img:not([src]{opacity:0;})

2.华为安卓4.4内置浏览器不支持flex的margin-right: auto; flex又没有justify-self属性
解决办法：给右边的button加绝对定位，给right值就行了，上下居中align-item:center在常见生效的，在华为这得设好top


*/