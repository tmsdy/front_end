/*
参考：https://juejin.im/post/5c446eb1e51d45517624f7db

xss攻击特点：恶意注入js代码攻击

攻击场景：
    1.获取cookie(伪造身份)：插入js脚本获取页面cookie，引入攻击者的js文件，js生成了一个img，img把cookie信息传给攻击者的后台。
	2.在线商城提交表单到后台，后台查看表单。若是提交脚本，脚本就会到后台工作人员的界面上运行，可以盗取cookie,看到http-referer后台地址，这样攻击者可以进入后台了
    3.也可以生成一个隐藏的iframe进行通信
    4....

防御XSS攻击：
1）防止盗取cookie：http响应头加HttpOnly禁止页面的JS访问Cookie

2）输入检查：对script脚本等特殊字符检查过滤，前后端都做。

3）渲染到页面要慎重：
    输出到页面的数据必须都要来自服务端，不要从DOM API获取数据来渲染页面,localStorage存的数据都可能是被改过的。
    渲染到页面的数据注意escape转义

防御攻击后端责任大：存数据库的字段必须是要检查转义的

*/
let str = '<script>123</script>'
console.log(escape(str))