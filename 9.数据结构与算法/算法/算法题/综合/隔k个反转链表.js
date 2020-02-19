function reverseLink(head) {
    if (!head || !head.next) return head
    let pre = null
    let current = head
    let next = null
    while (current) {
        next = current.next
        current.next = pre
        pre = current
        current = next
    }
    return pre
}
function reverseLink_k(head, k) {
    // 把链表值全放数组里面再排序操作
}