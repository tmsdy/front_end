$('html').css('font-size','50px')
let contentList = [
    {
        avatar: '',
        id: 4762319398201700 ,
        isLike: 0 ,
        likeTotal: 223,
        uid: 2478064464 ,
        qid: 4753623653100501 ,
        content: '三生三世十里桃花耶耶',
        uname: "君君阿泽爸"
    },
    {
        avatar: '',
        id: 4762319398201700 ,
        isLike: 0 ,
        likeTotal: 223,
        uid: 2478064464 ,
        qid: 4753623653100501 ,
        content: '耶耶耶开心耶耶耶开心耶耶耶开开耶开看看耶耶耶开心心耶耶耶开心耶开看看耶耶耶开心心耶耶耶开心',
        uname: "君君阿泽爸"
    },
    {
        avatar: '',
        id: 4762319398201700 ,
        isLike: 0 ,
        likeTotal: 223,
        uid: 2478064464 ,
        qid: 4753623653100501 ,
        content: '三生三世十里桃花',
        uname: "君君阿泽爸"
    },
    {
        avatar: '',
        id: 4762319398201700 ,
        isLike: 0 ,
        likeTotal: 223,
        uid: 2478064464 ,
        qid: 4753623653100501 ,
        content: '三生三世十里桃花耶耶耶开看看耶耶耶开心心耶耶耶开心',
        uname: "君君阿泽爸"
    },
    {
        avatar: '',
        id: 4762319398201700 ,
        isLike: 0 ,
        likeTotal: 223,
        uid: 2478064464 ,
        qid: 4753623653100501 ,
        content: '三生三世十里桃花耶耶',
        uname: "君君阿泽爸"
    },
    {
        avatar: '',
        id: 4762319398201700 ,
        isLike: 0 ,
        likeTotal: 223,
        uid: 2478064464 ,
        qid: 4753623653100501 ,
        content: '耶耶耶开心耶耶耶开心耶耶耶开开耶开看看耶耶耶开心心耶耶耶开心耶开看看耶耶耶开心心耶耶耶开心',
        uname: "君君阿泽爸"
    },
    {
        avatar: '',
        id: 4762319398201700 ,
        isLike: 0 ,
        likeTotal: 223,
        uid: 2478064464 ,
        qid: 4753623653100501 ,
        content: '三生三世十里桃花',
        uname: "君君阿泽爸"
    },
    {
        avatar: '',
        id: 4762319398201700 ,
        isLike: 0 ,
        likeTotal: 223,
        uid: 2478064464 ,
        qid: 4753623653100501 ,
        content: '三生三世十里桃花耶耶耶开看看耶耶耶开心心耶耶耶开心',
        uname: "君君阿泽爸"
    }
]

const renderList = function(contentList){
    let leftDom = '',
    rightDom = '',
    cardType = 'big'

    if(contentList.length>8){
        contentList.splice(8)
    }
    contentList.forEach((contentItem,index)=>{
        if(index%2){
            cardType = (index-1)%4 ? 'big':'small'
            rightDom += `
            <div class="comment-item ${cardType}">
                <div class="comment-top">
                    <img class="avatar" src="http://rookiefeifei.top/pho002.jpg" alt="头像" />
                    <span class="nickname">${contentItem.uname}</span>
                    <i class="icon-medal"></i>
                </div>
                <p class="comment-detail">
                    ${contentItem.content}
                </p>
                <div class="comment-bottom">
                    <i class="icon-share" data-click="callApp"></i>
                    <i class="icon-like-normal" data-click="callApp"></i>
                    <span class="mid-gray" data-click="callApp">${contentItem.likeTotal}</span>
                </div>
            </div>
            `
        }else{
            cardType = index%4?'small':'big'
            leftDom += `
            <div class="comment-item ${cardType} ${index==0?'fisrt':''}">
                <div class="comment-top">
                    <img class="avatar" src="http://rookiefeifei.top/pho002.jpg" alt="头像" />
                    <span class="nickname">${contentItem.uname}</span>
                    <i class="icon-medal"></i>
                </div>
                <p class="comment-detail">
                    ${contentItem.content}
                </p>
                <div class="comment-bottom">
                    <i class="icon-share" data-click="callApp"></i>
                    <i class="icon-like-normal" data-click="callApp"></i>
                    <span class="mid-gray" data-click="callApp">${contentItem.likeTotal}</span>
                </div>
            </div>
            `
        }
    })
    $('.column-left').html(leftDom)
    $('.column-right').html(rightDom)
}

const addCardStyle = function(){
    let bigCardList = $('.big .comment-detail')
    let smallCardList = $('.small .comment-detail')

    for(let i=0 ; i<bigCardList.length ;i++){
        let $bigCard = $(bigCardList[i])
        let lineHeight = parseInt($bigCard.css('line-height'))
        if($bigCard.height()>lineHeight*3){
            $bigCard.css('-webkit-box-orient','vertical')
            $bigCard.after('<div class="more" data-click="callApp"></div>')
        }
    }

    for(let i=0 ; i<smallCardList.length ;i++){
        let $smallCard = $(smallCardList[i])
        let lineHeight = parseInt($smallCard.css('line-height'))
        if($smallCard.height()>lineHeight*2){
            $smallCard.css('-webkit-box-orient','vertical')
            $smallCard.after('<div class="more" data-click="callApp"></div>')
        }
    }

}
console.log($)
renderList(contentList)

addCardStyle()

