
class Node {  //节点结构
    constructor(key) {
        this.key = key;
        this.left = null;
        this.right = null;
    }
}
/*
1.递归实现相对while写法要性能差点
2.如果像[1,2,3,4,5,6]这样添加进来的二叉搜索树性能差，所以这时候有平衡二叉搜索树做一点限制
*/
class BinarySearchTree {  
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
            }else{
                this._insertNode(node.left,newNode) ;
            }
        } else {
            if (node.right === null) {
                node.right = newNode;
            }else{
                this._insertNode(node.right,newNode) ;
            }
        }
    }
    find(key) {
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

    remove(key) {
        this.root = this.removeNode(this.root, key)
    }

    removeNode(node, key) {
        if (node == null) {
            return null;
        }

        if (key == node.key) {
            // no children node
            if (node.left == null && node.right == null) {
                return null;
            }
            if (node.left == null) {
                return node.right;
            }
            if (node.right == null) {
                return node.left;
            }

            let getSmallest = function (node) {
                if (node.left === null && node.right == null) {
                    return node;
                }
                if (node.left != null) {
                    return node.left;
                }
                if (node.right !== null) {
                    return getSmallest(node.right);
                }

            }
            let temNode = getSmallest(node.right);
            node.key = temNode.key;
            node.right = this.removeNode(temNode.right, temNode.key);
            return node;

        } else if (key < node.key) {
            node.left = this.removeNode(node.left, key);
            return node;
        } else {
            node.right = this.removeNode(node.right, key);
            return node;
        }
    }

  

}

