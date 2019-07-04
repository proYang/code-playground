/**
 * 输入一个链表， 反转链表后， 输出新链表的表头。
 */
/**
1->2->3->4->5->6->7->8->NULL
k: 3
3->2->1->6->5->4->8->7->NULL

// 反转k=3的链表
 */

function ListNode(x){
    this.val = x;
    this.next = null;
}
function reverseListGroup(head, k) {
    let count = 0;
    let current = head;
    let pre = head;
    let temp = null;
    for(let i = 0; i < k; i++) {
        count++;
        current = current.next;
    }
    if(count == k) {
        let current = reverseListGroup(current, k);
        let temp = null;
        while (count >= 0) {
            temp = pre.next;
            pre.next = current;
            count--;
        }
    }
    return pre;
}