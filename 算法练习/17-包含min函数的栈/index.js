/**
 * 定义栈的数据结构， 请在该类型中实现一个能够得到栈中所含最小元素的min函数（ 时间复杂度应为O（ 1））。
 */
// 数据栈
let stack = [];
// 临时队列  从大到小顺序
let queue = [];

function push(node) {
  // write code here
  if (stack.length === 0 || top() > node) {
    stack.push(node);
    stack = stack.concat(queue);
    queue = [];
  } else {
    queue.unshift(pop());
    push(node);
  }
}

function pop() {
  // write code here
  return stack.pop();
}

function top() {
  // write code here
  return stack[stack.length - 1];
}

function min() {
  // write code here
  console.log(stack)
  return top();
}

push(3)
min()
push(4)
min()
push(2)
min()
push(3)
min()
pop()
min()
pop()
min()
pop()
min()
push(0)
min()
console.log(stack)