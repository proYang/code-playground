/**
 * 用两个栈来实现一个队列， 完成队列的Push和Pop操作。 队列中的元素为int类型。
 * JS 用一个栈就行
 */
const stack = [];

function push(node) {
	// write code here
	stack.push(node);
}

function pop() {
	// write code here
	return stack.shift();
}
