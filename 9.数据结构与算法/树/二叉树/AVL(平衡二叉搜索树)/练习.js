class Node{
    constructor(key){
        this.key = key ;
        this.left = null ;
        this.right = null ;
    }
}
class AVLTree{
    constructor(){
        this.root = null;
    }
    insert(key){
        let node = new Node(key) ;
        if(this.root===null){
            this.root = node ;
        }else{
            this._insertNode(this.root,node) ;
        }
    }
    _insertNode(node,newNode){
        if(newNode.key<node.key){
            if(node.left===null){
                node.left = newNode
            }else{
                this._insertNode(node.left,newNode)
            }
        }else{
            if(node.right===null){
                node.right = newNode
            }else{
                this._insertNode(node.right,newNode)
            }
        }
    }
    find(key){
        var current = this.root ;
        while(current!==null){
            if(current.key===key)break ;
            current = current.key>key ? current.left : current.right ;
        }
        return current ;
    }
    
}
function isBST(node,arr=[]){ //中序遍历
    if(node!==null){
        isBST(node.left,arr) ;
        if(node.key<arr[arr.length-1]) return false ;
        arr.push(node.key) ;
        isBST(node.right,arr) ;
    }
    return true;
}
function isBalanced(node){ //前序遍历看是否平衡
    if(node===null) return true ;
    if(getBalanceFactor(node)>1) return false ;
    return isBalanced(node.left) && isBalanced(node.right) ;
}
function getBalanceFactor(node){
    return Math.abs(getHeight(node.left)-getHeight(node.right)) ;
}
function initHeight(node){ //后序遍历给每个节点都赋值上height
    if(node===null) return ;
    initHeight(node.left) ;
    initHeight(node.right) ;
    node.height = Math.max(getHeight(node.left),getHeight(node.right)) + 1 ;
}
function getHeight(node){
    if(node==null) return 0 ;
    return node.height ;
}