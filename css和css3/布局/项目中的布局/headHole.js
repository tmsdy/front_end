
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

let leftDom = '',
    rightDom = ''

contentList.forEach((contentItem,index)=>{
    if(index%2){
        rightDom += `
        <div class="comment-item ${(index-1)%4?'big':'small'}">
            <div class="comment-top">
                <img class="avatar" src="http://rookiefeifei.top/pho002.jpg" alt="头像" />
                <span class="nickname">${contentItem.uname}</span>
                <i class="icon-medal"></i>
            </div>
            <p class="comment-detail">
                ${contentItem.content}
            </p>
            <div class="comment-bottom">
                <i class="icon-share"></i>
                <i class="icon-like-normal"></i>
                <span class="mid-gray">${contentItem.likeTotal}</span>
            </div>
        </div>
        `
    }else{
        console.log(index)
        leftDom += `
        <div class="comment-item ${index%4?'small':'big'}">
            <div class="comment-top">
                <img class="avatar" src="http://rookiefeifei.top/pho002.jpg" alt="头像" />
                <span class="nickname">${contentItem.uname}</span>
                <i class="icon-medal"></i>
            </div>
            <p class="comment-detail">
                ${contentItem.content}
            </p>
            <div class="comment-bottom">
                <i class="icon-share"></i>
                <i class="icon-like-normal"></i>
                <span class="mid-gray">${contentItem.likeTotal}</span>
            </div>
        </div>
        `
    }
})

$('.column-left').html(leftDom)
$('.column-right').html(rightDom)