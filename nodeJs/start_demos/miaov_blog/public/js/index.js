$(function () {

    let $loginBox = $('#loginBox') ;
    let $registerBox = $('#registerBox') ;
    let $userInfo = $('#userInfo') ;

    //切换到注册面板
    $loginBox.find('.l-register-btn').on('click',()=>{
        $loginBox.hide() ;
        $registerBox.show() ;
    });
    //切换到登录面板
    $registerBox.find('.r-login-btn').on('click',()=>{
        $registerBox.hide() ;
        $loginBox.show() ;
    });
    //注册
    $registerBox.find('.r-register-btn').on('click',()=>{
        $.ajax({
            type:'post' ,
            url:'/api/user/register',
            data:{
                username: $registerBox.find('[name="username"]').val(),
                password : $registerBox.find('[name="password"]').val(),
                repassword : $registerBox.find('[name="repassword"]').val()
            },
            dataType:'json',
            success(res){
                $registerBox.find('.success-text').html(res.message) ;
                if(!res.code){//注册成功了
                    setTimeout(()=>{
                        $registerBox.hide() ;
                        $loginBox.show() ;
                    },800)
                }
            }
        })
    }) ;
    //登录
    $loginBox.find('.l-login-btn').on('click',()=>{
        $.ajax({
            type:'post',
            url:'/api/user/login',
            data:{
                username: $loginBox.find('[name="username"]').val(),
                password : $loginBox.find('[name="password"]').val()
            },
            dataType:'json',
            success(res){
                $loginBox.find('.success-text').html(res.message) ;
                if(!res.code){//登录成功了
                    window.location.reload();
                }
            }
        })
    });
    //退出
    $('#userInfo .logout').on('click',()=>{
        $.ajax({
            url:'/api/user/logout' ,
            success(res){
                console.log(res) ;
                if(!res.code){
                    window.location.reload() ;
                }
            }
        })
    }) ;
    for(let i=0 ; i<$('.listItem').length ; i++){

        $($('.listItem')[i]).on('click',(e)=>{
            let contentid = e.currentTarget.dataset.id ;
            window.location = '/view?contentid='+ contentid ;
        })

    }


});