/**
 * 输入一个链表， 输出该链表中倒数第k个结点。
 */
/*function ListNode(x){
    this.val = x;
    this.next = null;
}*/
function FindKthToTail(head, k) {
	// write code here
	const stack = [];
	let node = head;
	while (node) {
		stack.push(node);
		node = node.next;
	}
	let index = stack.length - k;
	return stack[index];
}