$(function () {

    let $pages = $('#pagination .page') ;

    for(let i=0 ; i<$pages.length ; i++){
        $($pages[i]).on('click',()=>{
            $pages[i].className = 'active' ;
        })
    }

});