
class Node {
    constructor(elem) {
        this.elem = elem
        this.next = null
    }
}

class LinkList {
    constructor() {
        this.head = new Node('head')
    }
    find(elem) {
        var curNode = this.head;
        while (curNode.elem != elem) {
            curNode = curNode.next
        }
        return curNode
    }
    insert(newElem, elem) { //把newElem元素插到elem的后面
        var newNode = new Node(newElem)
        var curNode = this.find(elem)
        newNode.next = curNode.next
        curNode.next = newNode
    }
    display() {
        var curNode = this.head;
        while (curNode.next !== null) {
            console.log(curNode.elem)
            curNode = curNode.next
        }
        console.log(curNode.elem)
    }

}