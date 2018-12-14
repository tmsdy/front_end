class Compile{
    constructor(el,vm){
        this.el = this.isElementNode(el)?el:document.querySelector(el) ;
        this.vm = vm ;
        if(this.el){
            // 1.先把这些真实的DOM移入内存中 fragment
            let fragment = this.node2Fragment(this.el) ;

            // 2.编译 => 提取想要的元素节点v-model和文本节点{{}}

            // 3.把编译好的fragment塞到页面里
        }
    }
    // 专门写一些辅助方法
    isElementNode(node){
        return node.nodeType ===1 ;//是元素
    }

    // 核心的方法
    node2Fragment(el){
        let fragment = document.createDocumentFragment() ;
    }

}