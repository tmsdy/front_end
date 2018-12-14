var prepage = 5;
var page = 1;
var pages = 0;
let comments = [];

//提交评论
$('#messageBtn').on('click', ()=> {
    $.ajax({
        type: 'POST',
        url: '/api/comment/post',
        data: {
            contentid: $('#contentId').val(),
            content: $('#messageContent').val()
        },
        success(resData) {
            console.log(resData);
            $('#messageContent').val('');
            comments = resData.data.comments.reverse();
            renderComment();
        }
    })
});
//每次页面刷新获取所有评论
$.ajax({
    url: '/api/comment',
    data: {
        contentid: $('#contentId').val()
    },
    success(resData) {
        comments = resData.data.reverse() ;
        renderComment();
    }
});

function renderComment() { //渲染评论页面的方法
    $('#messageCount').html(comments.length) ;

    let html = '' ;
    pages = Math.max(Math.ceil(comments.length / prepage), 1);
    let start = Math.max(0, (page-1) * prepage);
    let end = Math.min(start + prepage, comments.length);
    let $lis = $('.pager li');
    $lis.eq(1).html( page + ' / ' +  pages);

    if (page <= 1) {
        page = 1;
        $lis.eq(0).html('<span>没有上一页了</span>');
    } else {
        $lis.eq(0).html('<a href="javascript:;">上一页</a>');
    }
    if (page >= pages) {
        page = pages;
        $lis.eq(2).html('<span>没有下一页了</span>');
    } else {
        $lis.eq(2).html('<a href="javascript:;">下一页</a>');
    };
    if (comments.length == 0) {
        $('.messageList').html('<div class="messageBox"><p>还没有评论</p></div>');
    } else{
        for (let i=start ; i<end ;i++){
            html+=`<div class="messageBox">
                <p class="name clear">
                    <span class="fl">${comments[i].username}</span>
                    <span class="fr">${formatDate(comments[i].postTime)}</span>
                </p><p>${comments[i].content}</p>
            </div>
            `
        }
        $('.messageList').html(html) ;
    }


}
//事件委托写法给上一页下一页添加事件
$('.pager').delegate('a', 'click', function() {
    if ($(this).parent().hasClass('previous')) {
        page--;
    } else {
        page++;
    }
    renderComment();
});

function formatDate(d) {
    let date1 = new Date(d) ;
    return date1.getFullYear() + '年' + (date1.getMonth()+1) + '月' + date1.getDate() + '日 ' + date1.getHours() + ':' + date1.getMinutes() + ':' + date1.getSeconds();

}