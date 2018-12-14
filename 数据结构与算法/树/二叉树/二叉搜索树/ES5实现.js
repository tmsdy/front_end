/*
二叉搜索树
    1.每个节点值都大于所有左子树的值和小于右子树的值
    2.只要存储的数据具有可比较性都可以用二分搜索树处理
*/  

function searchTree() {
   
    var Node = function(key) {// 节点对象
             this.key = key;
             this.right = null;
             this.left = null;
         };
     
     var root = null;// 初始化根节点
 
     var insertnode = function(node, newnode) {// 判断插到左子树中还是右子树中
         if(newnode.key < node.key) {
             if(node.left === null) {
                 node.left = newnode;
             } else {
                 insertnode(node.left, newnode);
             }
         } else {
             if(node.right === null) {
                 node.right = newnode;
             } else {
                 insertnode(node.right, newnode);
             }
         }
     };
     this.insert = function(key) {
         var newNode = new Node(key);
         if(root === null) {// 判断插入的是否是根节点
             root = newNode;
         } else {
             insertnode(root, newNode);
         }
     };
     var zhongxu = function(node, callback) {// 中序遍历 左根右
         if(node !== null) {
             zhongxu(node.left, callback);
             callback(node.key);
             zhongxu(node.right, callback);
         }
     };
     this.zhongxubianli = function(callback) {
         zhongxu(root, callback);
     }
     
     var qianxu = function(node, callback) {// 前序遍历 根左右
         if(node !== null) {
             callback(node.key);
             zhongxu(node.left, callback);
             zhongxu(node.right, callback);
         }
     };
     
     var houxu = function(node, callback) {// 后序遍历 左右根
         if(node !== null) {
             zhongxu(node.left, callback);
             zhongxu(node.right, callback);
             callback(node.key);
         }
     };
 
 
 }
          