/**
 * 输入两个单调递增的链表， 输出两个链表合成后的链表， 当然我们需要合成后的链表满足单调递减规则。
 */
/*function ListNode(x){
    this.val = x;
    this.next = null;
}*/
/**
 * 递归合并
 */
function Merge(pHead1, pHead2) {
	// write code here
	if (pHead1 === null) return pHead2;
	if (pHead2 === null) return pHead1;
	let newNode = null;
	if (pHead1.val < pHead2.val) {
		newNode = pHead1;
		pHead1.next = Merge(pHead1.next, pHead2);
	} else {
		newNode = pHead2;
		pHead2.next = Merge(pHead1, pHead2.next);
	}
	return newNode
}