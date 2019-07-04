// 输入一个链表，按链表值从尾到头的顺序返回一个ArrayList

/*function ListNode(x){
    this.val = x;
    this.next = null;
}*/
function printListFromTailToHead(head) {
  // write code here
  const stack = [];
  let node = head;
  while (node) {
    stack.push(node.val);
    node = node.next;
  }
  stack.reverse();
  return stack;
}