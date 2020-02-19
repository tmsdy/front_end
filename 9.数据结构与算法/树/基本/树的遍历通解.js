class Tree{
    constructor(v,children){
        this.v = v ;
        this.children = children || null ;
    }
} 

/*
1.ord: 0表示前序 1,2表示中序 3以上表示后序(如果最大的度是3,的话) 为了判断什么时候执行console.log
2.一般是console.log处换成callback(tree.v)
*/
function tree_transverse(tree,ord = 0){
    let transversed = false ;
    if(!tree.children){
        console.log(tree.v) ;
        return ;
    }
    tree.children.forEach((child,i)=>{
        if(i===ord){
            transversed = true ;
            console.log(tree.v) ;
        }
        tree_transverse(child,ord) ;
    })
    if(!transversed){
        console.log(tree.v) ;
    }
}