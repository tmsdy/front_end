
class Node {  //节点结构
    constructor(key) {
        this.key = key;
        this.left = null;
        this.right = null;
        this.height = 1 ;
    }
}
/*
1.感觉每次添加时候更新每个节点的height做不到，还是得添加完，遍历一遍去给每个node赋值height
    赋值方法：node.height = Math.max(this.getHeight(node.left),this.getHeight(node.right)) + 1 ;
2.在二分搜索树的基础上标记了每个节点的height和平衡因子(就是左子树高度-右子树高度)
3.需要分别判断是不是二叉搜索树和平衡二叉树的一个函数
4.通过左旋转和右旋转维持平衡
    只有添加元素的时候，父级节点的平衡因子变化才可能引起失衡，需要向上回溯维护平衡
    每次添加节点是判断是否失衡，在失衡处把其父节点移到其右子树，其原右子树移到现右子树的左子树
*/
// 
class AVLTree {   
    constructor() {
        this.root = null;
    }
    insert(key){
        let newNode = new Node(key);
        if (this.root===null) {
            this.root = newNode;
        }else{
            this._insertNode(this.root,newNode) ;
        }
    }
    _insertNode(node,newNode) {
        if(newNode.key < node.key) {
            if (node.left === null) {
                node.left = newNode;
                console.log(isBalanced(this.root))//卡在这里判断平衡不准了
            }else{
                this._insertNode(node.left,newNode) ;
            }
        } else {
            if (node.right === null) {
                node.right = newNode;
                // console.log(isBalanced(this.root))
            }else{
                this._insertNode(node.right,newNode) ;
            }
        }
   
    }
    find(key) { //找某个节点，如果只是值是没意义，但你可以给节点加别的属性，比如你可以找到学号为xxx的同学的个人信息
        var current = this.root;
        while (current != null) {
            if (key == current.key) {
                break;
            }
            if (key < current.key) {
                current = current.left;
            } else {
                current = current.right
            }
        }
        return current.key;
    }  

}

function initHeight(node){ //给一个二叉树每个节点赋值高度，根节点最高，叶节点为1这样
    if(node==null) return 0 ; 
    initHeight(node.left) ;
    initHeight(node.right) ;
    node.height =  Math.max(getHeight(node.left),getHeight(node.right)) + 1 ;
}

function getHeight(node){
    if(node===null) return 0 ;
    return node.height ;
}

function isBST(node,arr=[]){ //判断二叉搜索树：中序遍历的元素是按顺序的从下到大的
    if(node!==null){
        isBST(node.left,arr) ;
        if(node.key<arr[arr.length-1]){
            return false ;
        }
        arr.push(node.key) ;
        isBST(node.right,arr) ;
    }
    return true ;
}
function isBalanced(node){ // 判断平衡二叉树：前序遍历看从上到下看平衡因子是否>1
    if(node===null) return true ;
    if(getBalanceFactor(node)>1) return false ;
    return isBalanced(node.left) && isBalanced(node.right) ;
}
function getBalanceFactor(node){ //平衡因子
    return Math.abs(getHeight(node.left) - getHeight(node.right))  ;
}

function rightRotate(nodeY){ //右旋转
    var x = nodeY.left ;
    var xR = x.right ;
    x.right = nodeY ;
    nodeY.left = xR ;
    //更新height
    x.height = Math.max(getHeight(x.left),getHeight(x.right)) + 1 ;
    nodeY.height = Math.max(getHeight(nodeY.left),getHeight(nodeY.right)) + 1 ;
    return x ;
}