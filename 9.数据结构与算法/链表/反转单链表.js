

function reverseList(head) {
    if (!head || !head.next) return head
    let current = head
    let pre = null
    let next

    while (current) { // 对角线赋值法
        next = current.next
        current.next = pre
        pre = current
        current = next
    }
    return pre
}