/**
 * 输入一个链表， 反转链表后， 输出新链表的表头。
 */

 /*function ListNode(x){
    this.val = x;
    this.next = null;
}*/
 function ReverseList(pHead) {
   // write code here
   let node = pHead;
   let preNode = null
   while(node) {
      let nextNode = node.next;

      // 指向前一个节点
      node.next = preNode;
      if(nextNode === null) {
        return node
      } else {
        preNode = node;
        node = nextNode;
      }
   }
 }